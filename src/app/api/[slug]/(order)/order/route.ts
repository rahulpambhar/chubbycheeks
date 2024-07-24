import { NextResponse } from "next/server";

import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getNextInvoice, activityLog, calculateExpectedDeliveryDate } from "../../utils";
import authOptions from "../../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/prismaClient";
import { parse } from "url";
import {
    getOrdersByPage, getOrders, getOrdersById, shiproketOrder, shiproketLogin, cancelOrder

} from './functions/route.js'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { temOrdrId, paymentId, repeatOrder, } = body?.orderInfo

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

        const daysFromNow = process.env.EXPECTED_DELIVERY ? parseInt(process.env.EXPECTED_DELIVERY, 10) : 10;

        if (isNaN(daysFromNow)) {
            throw new Error('EXPECTED_DELIVERY environment variable is not a valid number');
        }

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

            isPaid: temp?.isPaid,
            paidAt: new Date(),
            paymentNote: temp?.paymentNote,
            paymentId: paymentId,
            paymentMethod: temp.paymentMethod,

            orderStatus: "PROCESSING",
            processingAt: new Date(),

            expectedDate: calculateExpectedDeliveryDate(daysFromNow),

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
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "Login first.",
            });
        }
        const { isAdmin } = session?.user
        let body = await request.json();

        if (isAdmin) {

            const { id, orderStatus, data } = body

            if (orderStatus === "ACCEPTED") {

                if (id?.length === 0) {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Please select at least one order", });
                }


                for (const item of id) {
                    const order = await prisma.order.findUnique({
                        where: { id: item, isBlocked: false },
                        select: { orderStatus: true },
                    });


                    if (order && ['SHIPPED', 'CANCELLED', 'COMPLETE'].includes(order.orderStatus)) {
                        return NextResponse.json({
                            st: false,
                            statusCode: StatusCodes.BAD_REQUEST,
                            data: [],
                            msg: 'Order already processed',
                        });
                    }

                    await prisma.order.update({
                        where: { id: item, isBlocked: false },
                        data: {
                            orderStatus: orderStatus,
                            updatedBy: session?.user?.id,
                            updatedAt: new Date(),
                            acceptedAt: new Date(),
                        },
                    });
                }

                return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });

            }

            if (orderStatus === "SHIPPED") {

                const TEN_DAYS_IN_SECONDS = 86400 * 10;

                const res = await prisma.shiprocket_Auth.findFirst({
                    where: {
                        id: process.env.SHIPROKET_AUTH_DB_ID
                    }
                })


                if (res) {

                    const updatedAt: any = new Date(res.updatedAt);
                    const currentDate: any = new Date();
                    const timeDifference = (currentDate - updatedAt) / 1000;

                    if (timeDifference > TEN_DAYS_IN_SECONDS) {

                        const isShiproketLogin = await shiproketLogin()
                        if (!isShiproketLogin) {
                            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Shiproket login failed!", });
                        }

                        const setShiproketOrder = await shiproketOrder(body)

                        await prisma.shiprockeOrders.create({

                            data: {
                                channel_order_id: setShiproketOrder?.data?.channel_order_id,
                                order_id: setShiproketOrder?.data?.order_id,
                                shipment_id: setShiproketOrder?.data?.shipment_id,
                                createdAt: new Date(),
                                createdBy: session.user.id
                            }
                        })

                        await prisma.order.update({
                            where: { id }, data: { orderStatus: orderStatus, updatedBy: session?.user?.id }
                        })

                        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                    } else {
                        const setShiproketOrder = await shiproketOrder(body)

                        await prisma.shiprockeOrders.create({
                            data: {
                                channel_order_id: setShiproketOrder?.data?.channel_order_id,
                                order_id: setShiproketOrder?.data?.order_id,
                                shipment_id: setShiproketOrder?.data?.shipment_id,
                                createdAt: new Date(),
                                createdBy: session.user.id
                            }
                        })

                        await prisma.order.update({
                            where: { id },
                            data: { orderStatus: orderStatus, updatedBy: session?.user?.id }
                        })
                        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                    }

                } else {

                    const res = await prisma.shiprocket_Auth.create({
                        data: {
                            token: "123", // dummy token
                            updatedAt: new Date(),
                            updatedBy: session?.user?.id
                        }
                    })

                    return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "shiproket db id generated. update SHIPROKET_AUTH_DB_ID in .env", });
                }
            }

            if (orderStatus === "CANCELLED") {
                console.log('orderStatus::: ', orderStatus);

                const getCancelOrder = await cancelOrder(body)

                if (getCancelOrder?.st) {
                    return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                } else {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "something goes wrong!! contact to customer support", });
                }
            }

            if (orderStatus === "COMPLETE") {
                if (id?.length === 0) {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Please select at least one order", });
                }


                for (const item of id) {
                    const order = await prisma.order.findUnique({
                        where: { id: item, isBlocked: false },
                        select: { orderStatus: true },
                    });

                    if (!order) {
                        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Order not found", });
                    }

                    await prisma.order.update({
                        where: { id: item, isBlocked: false },
                        data: {
                            orderStatus: orderStatus,
                            updatedBy: session?.user?.id,
                            completedAt: new Date(),
                        },
                    });
                }
                return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });

            }

        } else {
            const { id, data, orderStatus, } = body

            if (orderStatus === "UPDATE") {

                const isOrder = await prisma.order.findUnique({
                    where:
                    {
                        id, isBlocked: false,
                        userId: session?.user?.id
                    },
                    include: { OrderItem: true }

                });

                if (!isOrder) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Order not found", }); }

                let items: any = []
                let itemCount: number = 0
                let totalAmt: number = 0
                let discountAmount: number = 0;
                let taxableAmount: number = 0
                let GST = 0
                let netAmount: number = 0
                const products = await prisma.products.findMany({
                    where: {
                        id: {
                            in: data?.selectedItems?.map((item: any) => item?.productId)
                        },
                        isBlocked: false
                    }
                })

                items = data?.selectedItems?.map((item: any) => {
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
                    const gst = item?.gst || 0

                    const total = qty * price
                    const discount = item?.discount

                    if (item.discountType === "PERCENTAGE") {
                        discountAmount += total * discount / 100

                        GST += (total - (total * discount / 100)) * gst / 100
                    } else {
                        discountAmount += qty * item?.discount
                        GST += ((total - (qty * item?.discount)) * gst) / 100
                    }

                    totalAmt += total;
                    itemCount += qty
                }

                taxableAmount = totalAmt - discountAmount
                netAmount = taxableAmount + GST

                const data_ = {
                    invoiceNo: isOrder.invoiceNo,
                    invoiceDate: isOrder.invoiceDate,
                    itemCount,

                    total: totalAmt,
                    discountAmount,
                    taxableAmount,
                    gst: GST,
                    otherCharge: 0,
                    netAmount: netAmount,

                    isPaid: isOrder.isPaid,
                    paidAt: isOrder.paidAt,
                    paymentId: isOrder.paymentId,
                    paymentMethod: isOrder.paymentMethod,
                    paymentNote: isOrder.paymentNote,
                    orderStatus: orderStatus || isOrder.orderStatus,
                    processingAt: isOrder.processingAt,
                    acceptedAt: isOrder.acceptedAt,
                    shippedAt: isOrder.shippedAt,
                    cancelledAt: isOrder.cancelledAt,
                    completedAt: isOrder.completedAt,
                    expectedDate: isOrder.expectedDate,
                    isBlocked: isOrder.isBlocked,
                    userId: isOrder.userId,
                    cartId: isOrder.cartId,
                    transportId: isOrder.transportId,
                    transportMode: isOrder.transportMode,
                    createdAt: isOrder.createdAt,
                    createdBy: isOrder.createdBy,
                    updatedAt: new Date(),
                    updatedBy: session?.user?.id,
                };

                await prisma.order.update({ where: { id: id, userId: session?.user?.id }, data: data_ })

                for (let x in isOrder?.OrderItem) {
                    const item = data?.selectedItems?.find((item: any) => item?.productId === isOrder?.OrderItem[x].productId)

                    if (item) {
                        await prisma.orderItem.update({
                            where: {
                                id: isOrder?.OrderItem[x].id
                            },
                            data: {
                                qty: item.qty,
                                price: isOrder?.OrderItem[x].price,
                                isBlocked: isOrder?.OrderItem[x].isBlocked,

                                orderId: isOrder?.id,
                                productId: item?.productId,

                                createdAt: isOrder?.OrderItem[x].createdAt,
                                createdBy: isOrder?.OrderItem[x].createdBy,

                                updatedBy: session?.user?.id,
                                updatedAt: new Date()
                            }
                        });
                    } else {

                        await prisma.orderItem.update({
                            where: {
                                id: isOrder?.OrderItem[x].id
                            },
                            data: {
                                isBlocked: true,
                            }
                        });
                    }
                }
                await activityLog("UPDATE", "order", data, session?.user?.id);
                return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });

            } else if (orderStatus === "CANCELLED") {

                const isOrder = await prisma.order.findUnique({
                    where: {
                        id: id,
                        userId: session?.user?.id,
                        isBlocked: false
                    },
                    include: {
                        OrderItem: {
                            where: {
                                isBlocked: false
                            },
                        },
                        user: true,
                    },

                });

                if (!isOrder) {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.NOT_FOUND, data: [], msg: "order not found!!" });
                }

                if (isOrder?.orderStatus === "CANCELLED") {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.NOT_FOUND, data: [], msg: "order already cancelled!!" });
                }

                if (isOrder?.orderStatus === "COMPLETE") {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.NOT_FOUND, data: [], msg: "order already completed!!" });
                }

                if (isOrder?.orderStatus === "PROCESSING" || isOrder?.orderStatus === "ACCEPTED") {
                    const abc = await prisma.order.update({
                        where:
                            { id: id, userId: session?.user?.id },
                        data: {
                            orderStatus: "CANCELLED",
                            cancelledAt: new Date(),
                            updatedBy: session?.user?.id
                        }
                    })
                    await activityLog("CANCEL", "order", data, session?.user?.id);
                    return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order cancelled successfully!", });
                }

                if (isOrder?.orderStatus === "SHIPPED") {
                    body.id = [id]

                    const getCancelOrder = await cancelOrder(body)

                    if (getCancelOrder?.st) {
                        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                    } else {
                        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "something goes wrong!! contact to customer support", });
                    }
                }
            }
        }
    } catch (error) {
        console.log('error-->', error);

        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], error, msg: "something went wrong!!" });

    }
}

