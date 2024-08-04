import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import prisma from "../../../../../../prisma/prismaClient";
import { json } from "stream/consumers";
import { getReturnOrders, getReturnOrdersById, getReturnOrdersByPage, shiproketReturnOrder } from "./functions/utils";
import { getProduct, getCart, getNextInvoice, activityLog, calculateExpectedDeliveryDate } from "../../utils";
// import { getOrdersByPage, getOrders, getOrdersById, cancelOrder } from './functions/utils.js'
import { shiproketLogin, } from '../order/functions/utils'
import { orderStatus as OrderStatus } from "../../../../utils";

export async function POST(request: Request) {
    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const formData = await request.formData();
        const orderID: any = formData.get("orderID");
        const returnNote: any = formData.get("returnNote");

        const selectedItemsStr = formData.get("selectedItems") as string | null;
        const selectedItems = selectedItemsStr ? JSON.parse(selectedItemsStr) : null;

        const attachment = formData.get("attachment") as File | null;



        if (returnNote.length > 500) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Return note should be less than 500 characters." });
        }

        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Login first." });
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

        let itemsNotInOrder = selectedItems.filter((item: any) => {
            return !order.OrderItem.find((orderItem: any) => {
                return orderItem.productId === item.productId;
            });
        });

        if (itemsNotInOrder.length > 0) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Items not found in order" });
        }

        let returnAttachment = ""

        if (attachment instanceof File && attachment.size > 0) {
            const bytes = await attachment.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const imageName = `${Date.now()}_${attachment.name}`;

            const path = `${process.cwd()}/public/returnAttachment/${imageName}`;
            await writeFile(path, buffer);
            returnAttachment = imageName;
        }

        let items: any = []
        let nextInvoice: string = ""
        let itemCount: number = 0
        let totalAmt: number = 0
        let discountAmount: number = 0;
        let taxableAmount: number = 0
        let GST = 0
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
                    orderedQty: item?.qty,
                    size: item?.size
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

        const res: any = await prisma.returnOrder.create({
            data: {
                invoiceNo: nextInvoice,
                invoiceDate: new Date(),

                itemCount: itemCount,

                total: totalAmt,
                discountAmount,
                taxableAmount,
                gst: GST,
                shippingCharge: 0,
                handlingCharge: 0,
                CODCharges: 0,
                netAmount: netAmount,

                isPaid: false,
                paidAt: new Date(),
                paymentNote: "",
                paymentId: "",
                paymentMethod: "COD",

                orderStatus: "PROCESSING",
                processingAt: new Date(),

                returnNote,
                attachment: returnAttachment,

                user: { connect: { id: userId } },
                order: { connect: { id: orderID } },
                Transport: { connect: { id: "65f67705f6a5e7edc22123e4" } },
                transportMode: "ROAD",

                createdAt: new Date(),
                createdBy: session?.user?.id,
                items: {
                    create: items.map((item: any) => {
                        return {
                            product: { connect: { id: item.id } },
                            qty: item.orderedQty,
                            size: item.size,
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
        const { query }: any = parse(request.url, true);
        let { slug, }: any = query



        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Login first." });
        }

        let isOrders: any = []

        if (slug === "getAll") {
            isOrders = await getReturnOrders(userId)
            return NextResponse.json({
                st: true,
                statusCode: StatusCodes.OK,
                data: isOrders,
                msg: "return order fetch success!",
            });
        } else if (slug === "getPaginated") {
            isOrders = await getReturnOrdersByPage(request)
        } else if (slug === "getById") {
            isOrders = await getReturnOrdersById(request)
        }

        if (!isOrders) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "No order found" });
        }

        return NextResponse.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: isOrders,
            msg: "return order fetch success!",
        });



    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function PUT(request: Request) {

    try {

        let session: any = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "Login first.",
            });
        }
        const { isAdmin } = session?.user
        let body = await request.json();
        body.session = session

        if (isAdmin) {

            const { id, orderStatus, data } = body

            if (orderStatus === "ACCEPTED") {

                if (id?.length === 0) {
                    return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "Please select at least one Return Order", });
                }


                for (const item of id) {
                    const returnOrder = await prisma.returnOrder.findUnique({
                        where: { id: item, isBlocked: false },
                        select: { orderStatus: true },
                    });


                    if (returnOrder && ['SHIPPED', 'CANCELLED', 'COMPLETE'].includes(returnOrder.orderStatus)) {
                        return NextResponse.json({
                            st: false,
                            statusCode: StatusCodes.BAD_REQUEST,
                            data: [],
                            msg: 'Return Order already processed',
                        });
                    }

                    await prisma.returnOrder.update({
                        where: { id: item, isBlocked: false },
                        data: {
                            orderStatus: orderStatus,
                            updatedBy: session?.user?.id,
                            updatedAt: new Date(),
                            acceptedAt: new Date(),
                        },
                    });
                }

                return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "Return order updated successfully!", });

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

                        const setShiproketOrder = await shiproketReturnOrder(body)

                        await prisma.shiprockeOrders.create({

                            data: {
                                channel_order_id: setShiproketOrder?.data?.channel_order_id,
                                order_id: setShiproketOrder?.data?.order_id,
                                shipment_id: setShiproketOrder?.data?.shipment_id,
                                isReturn: true,
                                createdAt: new Date(),
                                createdBy: session.user.id
                            }
                        })

                        await prisma.returnOrder.update({
                            where: { id }, data: { orderStatus: orderStatus, updatedBy: session?.user?.id }
                        })

                        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                    } else {

                        const setShiproketOrder = await shiproketReturnOrder(body)

                        if (!setShiproketOrder?.st) {
                            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: setShiproketOrder?.msg, });
                        }

                        await prisma.shiprockeOrders.create({
                            data: {
                                channel_order_id: setShiproketOrder?.data?.channel_order_id,
                                order_id: setShiproketOrder?.data?.order_id,
                                shipment_id: setShiproketOrder?.data?.shipment_id,
                                isReturn: true,
                                createdAt: new Date(),
                                createdBy: session.user.id
                            }
                        })



                        await prisma.returnOrder.update({
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

                // const getCancelOrder = await cancelOrder(body)

                // if (getCancelOrder?.st) {
                //     return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                // } else {
                //     return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "something goes wrong!! contact to customer support", });
                // }
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

                    if (order && ['CANCELLED', 'COMPLETE'].includes(order.orderStatus)) {
                        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: 'Order already processed', });
                    }

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
            const { name, mobile, country_code, address, city, state, country, pincode, } = data?.data || {}


            if (orderStatus === "UPDATE") {


                for (let item of data?.selectedItems) {
                    if (item?.size === "NONE" || item?.size === "") {
                        return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: `Please select size for ${item?.productId}`, });
                    }
                }

                const isOrderString = OrderStatus.includes(orderStatus);
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
                            orderedQty: item?.qty,
                            size: item?.size
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
                    name,
                    country_code,
                    mobile,

                    address,
                    city,
                    state,
                    pincode,
                    country,

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
                    orderStatus: isOrderString ? orderStatus : isOrder.orderStatus,
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
                                size: item.size,

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

                    // const getCancelOrder = await cancelOrder(body)

                    // if (getCancelOrder?.st) {
                    //     return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "order updated successfully!", });
                    // } else {
                    //     return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "something goes wrong!! contact to customer support", });
                    // }
                }
            }
        }

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "OTP removed" });

    } catch (error) {
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }

}