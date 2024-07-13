import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import { StatusCodes } from 'http-status-codes';
import { getProduct, getCart, getCartItem } from "../utils";
import authOptions from "../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/prismaClient";


async function getProductReviewsWithAvg(id: string) {
    const [reviews, avgRating] = await Promise.all([
        prisma?.review?.findMany({
            where: {
                productId: id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        country: true,
                        profile_pic: true,
                    }
                }
            }
        }),
        prisma?.review?.aggregate({
            where: {
                productId: id,
            },
            _avg: {
                rating: true
            }
        })
    ]);

    const averageRating = avgRating._avg.rating;
    console.log('averageRating::: ', averageRating);

    return { reviews, averageRating };
}


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
        const { review, ratings, id } = body.payload

        const isReview = await prisma.review.findFirst({
            where: {
                userId: session?.user?.id,
                productId: id,
            }
        })

        if (!isReview) {
            const res = await prisma.review.create({
                data: {
                    rating: +ratings,
                    review,
                    userId: session?.user?.id,
                    productId: id,
                    createdBy: session?.user?.id,
                    updatedBy: session?.user?.id,
                }
            })
        } else {
            const res = await prisma.review.update({
                where: {
                    id: isReview.id
                },
                data: {
                    review,
                    rating: +ratings,
                    updatedBy: session?.user?.id,
                }
            })
        }
        const { reviews, averageRating } = await getProductReviewsWithAvg(id);
        const data = { reviews, averageRating };


        return NextResponse.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: data,
            msg: "Review appreciated.",
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

        const { query }: any = parse(request.url, true);
        let { id, }: any = query;


        const { reviews, averageRating } = await getProductReviewsWithAvg(id);
        const data = { reviews, averageRating };

        return NextResponse.json({
            st: true, statusCode: StatusCodes.OK, data, msg: "review list fetch.",
        });

    } catch (error) {
        console.log('error::: ', error);
        return NextResponse.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, error, msg: "something went wrong!!", });
    }
}