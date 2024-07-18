import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import prisma from "../../../../../prisma/prismaClient";
import authOptions from "../../auth/[...nextauth]/auth";



export async function POST(request: Request) {

    try {
        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({
                st: false,
                msg: "Login first.",
            });
        }

        const body = await request.json();
        const { name, email, message }: any = body

        const isRes: any = await prisma.getInTouch.create({
            data: {
                name, email, message,
                userId,
                createdAt: new Date()
            }
        });

        if (!isRes) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "something went wrong!!" });
        }

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "Message sent successfully" });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}
