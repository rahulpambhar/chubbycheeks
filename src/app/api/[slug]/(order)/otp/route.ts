import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import prisma from "../../../../../../prisma/prismaClient";



export async function POST(request: Request) {
    try {

        let session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!session) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "You are not logged in" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const res = await prisma.user.update({ where: { id: userId }, data: { otp } });
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: res.otp, msg: "otp sent as sms to mobile" });
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
        let { typedOTP }: any = query;

        if (!typedOTP) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Please provide otp" });
        }

        const OTP: any = await prisma.user.findUnique({
            where: { id: userId },
            select: { otp: true }
        });

        if (!OTP.otp) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Generate new OTP!" });
        }

        if (parseInt(typedOTP) !== OTP.otp) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Wrong otp!" });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { otp: null }
        });
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "OTP verified" });

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