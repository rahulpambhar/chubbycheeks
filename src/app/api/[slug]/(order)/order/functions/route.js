import { parse } from "url";
import prisma from "../../../../../../../prisma/prismaClient";
import { OrderStatus } from "@prisma/client";



export async function getOrders(id) {

    const orders = await prisma.order.findMany({
        where: {
            userId: id,
            isBlocked: false,
        },

        include: {
            OrderItem: {
                include: {
                    product: {
                        where: {
                            isBlocked: false
                        }
                    },
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
    });

    return orders;
}

const orderStatusMap = {
    PROCESSING: 'PROCESSING',
    ACCEPTED: 'ACCEPTED',
    DISPATCHED: 'DISPATCHED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    RETURNED: 'RETURNED',
    REFUNDED: 'REFUNDED',
};

const getOrderStatusEnum = (search) => {
    return orderStatusMap[search.toUpperCase()] || undefined;
};

export const getOrdersByPage = async (request) => {
    const { query } = parse(request.url, true);
    const { page = 1, limit = 10, search = '', slug = '', from, to } = query;

    const parsedPage = parseInt(page, 10) - 1;
    const parsedLimit = parseInt(limit, 10);
    const offset = parsedPage * parsedLimit;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;



    let where = {
        isBlocked: false,
        createdAt: {
            gte: fromDate,
            lte: toDate,
        },
        OR: search !== "" ? [
            {
                OR: [
                    {
                        invoiceNo: {
                            equals: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        orderStatus: getOrderStatusEnum(search)
                    }

                ]

            },
            {
                user: {
                    OR: [
                        {
                            email: {
                                equals: search,
                                mode: 'insensitive'
                            }
                        },
                        {
                            mobile: {
                                equals: search,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            }
        ] : undefined
    };



    let count = await prisma.order.count({
        where: where,
    });

    let list = await prisma.order.findMany({
        where: where,
        include: {
            OrderItem: {
                include: {
                    product: true,
                }
            },
            user: true,
        },
        take: parsedLimit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
    });

    if (!list) {
        return {
            st: false,
            data: [],
            msg: "No Orders found",
        };
    }

    return {
        limit: parsedLimit,
        current_page: parsedPage + 1,
        total_pages: Math.ceil(count / parsedLimit),
        data: list,
    };
};


export const getOrdersById = async (request) => {
    const { query } = parse(request.url, true);
    const { id = '' } = query;

    const order = await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            OrderItem: {
                include: {
                    product: true,
                }
            },
            user: true,
            Transporter: true
        },
    });
    return order
}