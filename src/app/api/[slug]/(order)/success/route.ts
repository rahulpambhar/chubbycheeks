import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from "next-auth";
import paypal from 'paypal-rest-sdk';



export async function GET(request: Request) {

    try {
        // let session: any = await getServerSession();
        // if (!session) { return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: [], msg: "You are not logged in", }); }
        // return NextResponse.redirect("/success");
        // const { query } = parse(request.url, true);
        // let { payerId, paymentId }: any = query;
        // console.log('query::: ', query);

        // const execute_payment_json = {
        //     "payer_id": payerId,
        //     "transactions": [{
        //         "amount": {
        //             "currency": "USD",
        //             "total": "1.00"
        //         }
        //     }]
        // };

        // paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        //     if (error) {
        //         console.log(error.response);
        //         throw error;
        //     } else {
        //         console.log("Get Payment Response");
        //         console.log(JSON.stringify(payment));
        const absoluteUrl = new URL("/success", "http://localhost:3000").toString();

        return NextResponse.rewrite(absoluteUrl);
        // return NextResponse.redirect("/success")
        //     }
        // });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, data: [], error, msg: "something went wrong!!" });
    }
}
