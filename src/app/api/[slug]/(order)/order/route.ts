import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getNextInvoice, activityLog, getOrders } from "../../utils";
import authOptions from "../../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/prismaClient";
import paypal from 'paypal-rest-sdk';
// import { paypal_mode, paypal_client_id, paypal_client_secret } from "../../../../../../env";
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const temp: any = await prisma.tempOrder.findFirst({
            where: {
                id: body.tempId,
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
        if (!session) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "You are not logged in", }); }

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

            isPaid: temp.isPaid,
            paidAt: temp.paidAt,
            payStatus: temp.payStatus,
            paymentDetail: "payment done",
            paymentMethod: temp.paymentMethod,

            orderStatus: "PENDING",
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

        // paypal.configure({
        //     'mode': 'sandbox', //sandbox or live
        //     'client_id': "paypal_client_id",
        //     'client_secret': "paypal_client_secret"
        // });

        // var create_payment_json = {
        //     "intent": "sale",
        //     "payer": {
        //         "payment_method": "paypal"
        //     },
        //     "redirect_urls": {
        //         "return_url": "http://localhost:3000/api/pay_success/success",
        //         "cancel_url": "http://localhost:3000/api/pay_cancel/cancel"
        //     },
        //     "transactions": [{
        //         "item_list": {
        //             "items": [{
        //                 "name": "item",
        //                 "sku": "item",
        //                 "price": "1.00",
        //                 "currency": "USD",
        //                 "quantity": 1
        //             }]
        //         },
        //         "amount": {
        //             "currency": "USD",
        //             "total": "1.00"
        //         },
        //         "description": "This is the payment description."
        //     }]
        // };


        // paypal.payment.create(create_payment_json, function (error, payment: any) {
        //     if (error) {
        //         console.log('error::: ', error);
        //         throw error;
        //     } else {


        //         // for (let i = 0; i < payment?.links.length; i++) {

        //         //     if (payment?.links[i].rel === 'approval_url') {
        //         //         console.log('payment.links[i].href::: ', payment?.links[i].rel, payment.links[i].href);

        //         //         // NextResponse.redirect(payment.links[i].href)
        //         // return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: payment, msg: "order created successfully!" });
        //         //     }

        //         // }
        //         // console.log(payment);
        //     }
        // });


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
                id: body.tempId
            },
            data: {
                isBlocked: true,
                updatedBy: session?.user?.id,
                items: {
                    updateMany: {
                        where: {
                            tempOrderId: body.tempId
                        },
                        data: {
                            isBlocked: true,
                            updatedBy: session?.user?.id
                        }
                    }
                }
            }
        })

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

        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "You are not logged in",
            });
        }

        const isOrders = await getOrders(session?.user?.id)

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