import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";



export async function GET(request: Request) {

    try {
        let session: any = await getServerSession();
        if (!session) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "You are not logged in..", }); }
       
        return NextResponse.redirect("/cancel");

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}
