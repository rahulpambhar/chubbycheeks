import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getNextInvoice, activityLog } from "../../utils";
import authOptions from "../../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../../prisma/prismaClient";


export async function POST(request: Request) {
    try {

        let session: any = await getServerSession(authOptions);
        if (!session) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "You are not logged in", }); }

        const body = await request.json();
        const { orderMeta } = body
        let nextInvoice: string = ""
        let items: any = []
        let cart: any = {}
        let order: any = {}

        let itemCount: number = 0
        let totalAmt: number = 0
        let discountAmount: number = 0;
        let taxableAmount: number = 0
        let GST = 18 //  default percentage, do it dynamic according to tax
        let netAmount: number = 0



        nextInvoice = await getNextInvoice("tempOrder")

        const products = await prisma.products.findMany({
            where: {
                id: {
                    in: orderMeta?.selectedItems?.map((item: any) => item?.productId)
                },
                isBlocked: false
            }
        })

        items = orderMeta?.selectedItems?.map((item: any) => {
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

        let data: any = {
            invoiceNo: nextInvoice,
            invoiceDate: new Date(),

            itemCount,

            total: totalAmt,
            discountAmount,
            taxableAmount,
            tax: GST,
            otherCharge: 0,
            netAmount: netAmount,

            isPaid: true,
            paidAt: new Date(),
            payStatus: "SUCCESS",
            paymentDetail: "paayment done",
            paymentMethod: "online",

            user: { connect: { id: session?.user?.id } },
            Transport: { connect: { id: "65f67705f6a5e7edc22123e4" } },
            createdBy: session?.user?.id
        }

        const itemData: any = []

        for (let item of items) {
            itemData.push({
                qty: item?.orderedQty,
                price: item?.price,
                productId: item?.id,
                createdBy: session?.user?.id
            })
        }
        const createTemp = await prisma.tempOrder.create({ data })

        if (!createTemp) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "order created unsuccess!", });
        }

        const createTempItem = await prisma.tempOrderItem.createMany({
            data: itemData.map((item: any) =>
            ({
                ...item,
                tempOrderId: createTemp.id,
            }))
        })

        await activityLog("INSERT", "tempOrder", data, session?.user?.id);
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "Temp order created successfully!", temOrdrId: createTemp.id });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

// export async function GET(request: Request) {
//     try {
//         let session: any = await getServerSession(authOptions);

//         if (!session) {
//             return NextResponse.json({
//                 st: false,
//                 data: [],
//                 msg: "You are not logged in",
//             });
//         }

//         const isCart = await getCart(session?.user?.id)

//         return NextResponse.json({
//             st: true,
//             statusCode: StatusCodes.OK,
//             data: isCart,
//             msg: "Cart updated!",
//         });

//     } catch (error) {
//         console.log('error::: ', error);
//         return NextResponse.json({
//             st: false,
//             statusCode: StatusCodes.BAD_REQUEST,
//             error,
//             msg: "something went wrong!!",
//         });
//     }
// }