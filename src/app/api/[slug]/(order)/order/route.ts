import { NextResponse } from "next/server";

import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getNextInvoice, activityLog, } from "../../utils";
import authOptions from "../../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/prismaClient";
import { parse } from "url";
import { getOrdersByPage, getOrders,getOrdersById } from './functions/route.js'


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { temOrdrId, paymentId, repeatOrder } = body?.orderInfo

        const temp: any = await prisma.tempOrder.findFirst({
            where: {
                id: temOrdrId,
                isBlocked: false
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        let session: any = await getServerSession(authOptions);
        if (!session) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Login first.", }); }

        const nextInvoice = await getNextInvoice("order")
        const items = temp?.items


        const data: any = {
            invoiceNo: nextInvoice,
            invoiceDate: new Date(),

            itemCount: temp.itemCount,
            total: temp.total,
            discountAmount: temp.discountAmount,
            taxableAmount: temp.taxableAmount,
            tax: temp.tax,
            otherCharge: temp.otherCharge,
            netAmount: temp.netAmount,
            gst: temp.gst,

            isPaid: true,
            paidAt: new Date(),
            payStatus: "SUCCESS",
            paymentDetail: "Razorpay",
            paymentId: paymentId,
            paymentMethod: temp.paymentMethod,

            orderStatus: "PROCESSING",
            pendingAt: new Date(),

            user: { connect: { id: session?.user?.id } },
            Transport: { connect: { id: "65f67705f6a5e7edc22123e4" } },
        }

        const itemData: any = []

        for (let x in items) {
            itemData.push({
                qty: items[x]?.qty,
                price: items[x]?.price,
                productId: items[x]?.productId,
                createdBy: session?.user?.id
            })
        }

        let createOrder: any = null;
        createOrder = await prisma.order.create({ data })



        if (!createOrder) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "order created unsuccess!", });
        }

        const createItem = await prisma.orderItem.createMany({
            data: itemData.map((item: any) =>
            ({
                ...item,
                orderId: createOrder.id,
            }))
        })

        const blockTemp: any = await prisma.tempOrder.update({
            where: {
                id: temOrdrId
            },
            data: {
                isBlocked: true,
                updatedBy: session?.user?.id,
                items: {
                    updateMany: {
                        where: {
                            tempOrderId: temOrdrId
                        },
                        data: {
                            isBlocked: true,
                            updatedBy: session?.user?.id
                        }
                    }
                }
            }
        })

        if (!repeatOrder) {

            const itemsToUpdate = await prisma.cartItem.findMany({
                where: {
                    checked: true,
                    isBlocked: false
                }
            });

            const updatePromises = itemsToUpdate.map(item => {
                return prisma.cartItem.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        isBlocked: true
                    }
                });
            });

            await Promise.all(updatePromises);
        }


        await activityLog("INSERT", "order", data, session?.user?.id);
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order created successfully!", });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function GET(request: Request) {
    try {
        let session: any = await getServerSession(authOptions);
        const { query }: any = parse(request.url, true);
        let { slug, }: any = query

        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "Login first.",
            });
        }

        let isOrders: any = []

        if (slug === "getAll") {
            isOrders = await getOrders(session?.user?.id)
        } else if (slug === "getPaginated") {
            isOrders = await getOrdersByPage(request)
        } else if (slug === "getById") {
            isOrders = await getOrdersById(request)
        }

        return NextResponse.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: isOrders,
            msg: "order fetch success!",
        });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({
            st: false,
            statusCode: StatusCodes.BAD_REQUEST,
            error,
            msg: "something went wrong!!",
        });
    }
}

export async function PUT(request: Request) {

    try {

        let session: any = await getServerSession(authOptions);
        const { isAdmin } = session?.user

        if (!isAdmin) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "UnAuthorized", });
        }


        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "Login first.",
            });
        }

        const body = await request.json();
        const { id, orderStatus } = body

        await prisma.order.update({
            where: {
                id
            },
            data: {
                orderStatus: orderStatus,
                pendingAt: new Date(),
                updatedBy: session?.user?.id
            }
        })

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });


    } catch (error) {
        console.log('error::: ', error);

        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], error, msg: "something went wrong!!" });

    }

}