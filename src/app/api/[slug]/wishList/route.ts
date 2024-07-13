import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getCartItem } from "../utils";
import authOptions from "../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/prismaClient";


export async function POST(request: Request) {
    try {
        let session: any = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                st: false,
                data: [],
                msg: "You are not logged in",
            });
        }
        const body = await request.json();
        const { productId, } = body.payload

        const isInWishList = await prisma.whishlist.findFirst({
            where: {
                userId: session?.user?.id,
                productId: productId,
            }
        })

        if (!isInWishList) {
            await prisma.whishlist.create({
                data: {
                    user: {
                        connect: {
                            id: session?.user?.id
                        }
                    },
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    createdBy: session?.user?.id,
                }
            })
        }else{
            await prisma.whishlist.delete({
                where: {
                    id: isInWishList.id
                }
            })
        }

        const whishlist = await prisma.user.findMany({
            where: {
                id: session?.user?.id,
            },
            select: {
                whishlist: true
            }
        })

        return NextResponse.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: whishlist[0],
            msg: "Wishlist updated.",
        });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({
            st: false,
            data: [],
            error,
            msg: "something went wrong!!",
        });
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
        const wishList = await prisma.user.findMany({
            where: {
                id: session?.user?.id,
            },
            select: {
                whishlist: true
            }
        })

        if (wishList.length === 0) {
            return NextResponse.json({
                st: false,
                statusCode: StatusCodes.OK,
                data: [],
                msg: "Wishlist is empty.",
            });
        }


        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: wishList[0]?.whishlist, msg: "whish list fetch.", });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, error, msg: "something went wrong!!", });
    }
}