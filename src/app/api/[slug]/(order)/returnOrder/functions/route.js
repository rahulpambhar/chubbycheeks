
import prisma from "../../../../../../../prisma/prismaClient";


export const getReturnOrders = async (userId) => {

    try {

        const returnOrders = await prisma.returnOrder.findMany({
            where: { isBlocked: false, userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        })

        return returnOrders;

    } catch (error) {
        console.log('error::: ', error);
        return { st: false, data: [], msg: "something went wrong!!" }
    }
}
export const getReturnOrdersByPage = async (request) => {
    const { query } = parse(request.url, true);
    const { page = 1, limit = 10, search = '', slug = '', from, to } = query;

    const parsedPage = parseInt(page, 10) - 1;
    const parsedLimit = parseInt(limit, 10);
    const offset = parsedPage * parsedLimit;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    try {
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



        let count = await prisma.returnOrder.count({
            where: where,
        });

        let list = await prisma.returnOrder.findMany({
            where: where,
            include: {
                items: {
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

        if (!list) { return { st: false, data: [], msg: "No Orders found" }; }

        return { limit: parsedLimit, current_page: parsedPage + 1, total_pages: Math.ceil(count / parsedLimit), data: list, };
    } catch (error) {
        console.log('error::: ', error);
        return { st: false, data: [], msg: "something went wrong!!" }
    }
};
