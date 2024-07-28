import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
// import prisma from "../../../../../../prisma/prismaClient";
import prisma from "../../../../../prisma/prismaClient";
import nodemailer from 'nodemailer';


export async function POST(request: Request) {
    try {

        const body = await request.json();
        const { email } = body
        const user = await prisma.user.findFirst({
            where: {
                email,
                isBlocked: false
            }
        });

        if (!user) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const res = await prisma.user.update({ where: { id: user?.id }, data: { otp } });
        const emailSecrates = process.env.EMAIL_SECRATE

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "pambharrahul@gmail.com",
                pass: emailSecrates
            }
        });

        const htmlContent = `
        <h1>OTP</h1>
        <p><strong>otp is:</strong> ${otp}</p>`;

        const mailOptions = {
            from: "pambharrahul@gmail.com",
            to: user?.email,
            subject: 'Change Password',
            text: 'From the application!',
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return NextResponse.json({ st: false, data: {}, error, msg: "something went wrong!!", })
            }
        });
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: res.otp, msg: "Otp sent to your registered email id." });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function GET(request: Request) {
    try {

        const { query } = parse(request.url, true);
        let { typedOTP, email }: any = query;


        const isUser = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!isUser) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "User not found" });
        }



        if (!typedOTP) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Please provide otp" });
        }

        const OTP: any = await prisma.user.findUnique({
            where: { id: isUser?.id },
            select: { otp: true }
        });

        if (!OTP.otp) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Generate new OTP!" });
        }

        if (parseInt(typedOTP) !== OTP.otp) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "Wrong otp!" });
        }

        // await prisma.user.update({
        //     where: { id: isUser?.id },
        //     data: { otp: null }
        // });
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "OTP verified" });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}

export async function PUT(request: Request) {

    try {

        const body = await request.json();
        const { email } = body
        const user = await prisma.user.findFirst({
            where: {
                email,
                isBlocked: false
            }
        });

        if (!user) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.OK, data: [], msg: "User not found" });
        }

        await prisma.user.update({
            where: { id: user?.id },
            data: { otp: null }
        });

        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: [], msg: "OTP Expired" });

    } catch (error) {
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }

}