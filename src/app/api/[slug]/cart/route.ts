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
        const { productId, action } = body.payload

        const product = await getProduct(productId)
        let cart = await getCart(session?.user?.id)

        if (!product) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'So sorry product is not in stock!!', data: cart });
        }

        let cartItem: any;

        if (cart) {

            const isItemExist = await getCartItem(cart.id, product.id)
            if (isItemExist) {
                if (action === 'add') {
                    const updatedQty = isItemExist.qty ? isItemExist.qty + 1 : 1;
                    cartItem = await prisma.cartItem.update({
                        where: {
                            id: isItemExist.id
                        },
                        data: {
                            qty: updatedQty,
                            updatedAt: new Date(),
                            updatedBy: session?.user?.id
                        }
                    })
                } else if (action === "remove") {
                    const updatedQty = isItemExist.qty ? isItemExist.qty - 1 : 1;
                    cartItem = await prisma.cartItem.update({
                        where: {
                            id: isItemExist.id
                        },
                        data: {
                            qty: updatedQty,
                            updatedAt: new Date(),
                            updatedBy: session?.user?.id
                        }
                    })
                } else if (action === "delete") {

                    cartItem = await prisma.cartItem.update({
                        where: {
                            id: isItemExist.id
                        },
                        data: {
                            isBlocked: true,
                            updatedBy: session?.user?.id,
                            updatedAt: new Date(),
                        }
                    })
                }

            } else {
                cartItem = await prisma.cartItem.create({
                    data: {
                        qty: 1,
                        updatedAt: new Date(),
                        Cart: {
                            connect: {
                                id: cart.id
                            }
                        },
                        product: {
                            connect: {
                                id: product.id
                            }
                        }
                    }
                })
            }
        } else {

            cartItem = await prisma.cart.create({
                data: {
                    user: {
                        connect: {
                            id: session?.user?.id
                        }
                    },
                    CartItem: {
                        create: {
                            qty: 1,
                            createdAt: new Date(),
                            product: {
                                connect: {
                                    id: product.id
                                }
                            }
                        }
                    }
                }
            });
        }

        if (!cartItem) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'So sorry product not updated in cart!!', data: cart });
        }

        cart = await getCart(session?.user?.id)

        return NextResponse.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: cart,
            msg: "Cart updated!",
        });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({
            st: false,
            data: {},
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

        const isCart = await getCart(session?.user?.id)
        
        if (!isCart) {
            return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, data: isCart, msg: "Cart fetch unsuccess!", });
        }
        return NextResponse.json({ st: true, statusCode: StatusCodes.OK, data: isCart, msg: "Cart fetch success!", });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, error, msg: "something went wrong!!", });
    }
}