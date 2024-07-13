import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import prisma from "../../../../../prisma/prismaClient";



export async function POST(request: Request) {

    try {
        const body = await request.json();
        const { email }: any = body

        const isEmail: any = await prisma.newsletter.findFirst({
            where: { email: email, },
        });

        if (isEmail) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "email already subscribed!!!" });
        }

        const res = await prisma.newsletter.create({
            data: { email: email, },
        });

        if (!res) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], msg: "something went wrong!!" });
        }

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "subscribed successfully." });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}
