import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import prisma from "../../../../../../../prisma/prismaClient";
import { getNextInvoice } from "../../../utils";

export async function GET(request: Request) {
    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Login first." });
        }

        const returnOrders: any = await prisma.returnOrder.findMany({
            where: { isBlocked: false, userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: returnOrders, msg: "Return order found" });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

