import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import prisma from "../../../../../../prisma/prismaClient";
import { getNextInvoice } from "../../utils";



export async function POST(request: Request) {
    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const body = await request.json();
        const { orderID, selectedItems } = body;


        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "You are not logged in" });
        }

        const order: any = await prisma.order.findFirst({
            where: { id: orderID, isBlocked: false },
            include: { OrderItem: true }
        })

        const orderReturn: any = await prisma.returnOrder.findFirst({
            where: { orderId: orderID, isBlocked: false },
        })

        if (orderReturn) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Return order already created." });
        }

        if (!order) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Order not found" });
        }

        let itemsNotInDatabase = selectedItems.filter((item: any) => {
            return !order.OrderItem.find((orderItem: any) => {
                return orderItem.productId === item.productId;
            });
        });

        if (itemsNotInDatabase.length > 0) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Items not found in order" });
        }

        let items: any = []
        let nextInvoice: string = ""
        let itemCount: number = 0
        let totalAmt: number = 0
        let discountAmount: number = 0;
        let taxableAmount: number = 0
        let GST = 18 //  default percentage, do it dynamic according to tax
        let otherCharge = 0
        let netAmount: number = 0

        nextInvoice = await getNextInvoice("returnOrder")
        const products = await prisma.products.findMany({
            where: {
                id: {
                    in: selectedItems?.map((item: any) => item?.productId)
                },
                isBlocked: false
            }
        })

        items = selectedItems?.map((item: any) => {
            const product = products?.find((product: any) => {
                return product?.id === item?.productId;
            });

            if (product) {
                return {
                    ...product,
                    orderedQty: item?.qty
                };
            }
        })

        for (let item of items) {

            const qty = item?.orderedQty
            const price = item?.price

            const total = qty * price
            const discount = item?.discount

            if (item.discountType === "PERCENTAGE") {
                discountAmount += total * discount / 100
            } else {
                discountAmount += qty * item?.discount
            }
            totalAmt += total;
            itemCount += qty
        }

        taxableAmount = totalAmt - discountAmount
        GST = (GST * taxableAmount) / 100

        netAmount = taxableAmount + GST

        const res: any = await prisma.returnOrder.create({
            data: {
                invoiceNo: nextInvoice,
                invoiceDate: new Date(),

                itemCount: itemCount,

                discountAmount: discountAmount,
                total: totalAmt,
                taxableAmount: taxableAmount,
                tax: GST,
                otherCharge: otherCharge,
                netAmount: netAmount,

                isPaid: false,
                payStatus: 'PENDING',

                orderRerunrnStatus: "PENDING",
                pendingAt: new Date(),

                user: { connect: { id: userId } },
                order: { connect: { id: orderID } },
                Transport: { connect: { id: "65f67705f6a5e7edc22123e4" } },
                transportMode: "AIR",

                createdAt: new Date(),
                createdBy: session?.user?.id,
                items: {
                    create: items.map((item: any) => {
                        return {
                            product: { connect: { id: item.id } },
                            qty: item.orderedQty
                        }
                    })
                },
            }
        });

        if (!res) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Failed to create return order" });
        }

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "Return request received." });
    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function GET(request: Request) {
    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "You are not logged in" });
        }

        const { query } = parse(request.url, true);
        let { orderID }: any = query;

        if (!orderID) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Order ID is required" });
        }

        const isReturnOrder: any = await prisma.returnOrder.findFirst({ where: { orderId: orderID, isBlocked: false }, })

        if (!isReturnOrder) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Return order not found" });
        }
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: isReturnOrder, msg: "Return order found" });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function PUT(request: Request) {

    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "You are not logged in" });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { otp: null }
        });

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "OTP removed" });

    } catch (error) {
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }

}