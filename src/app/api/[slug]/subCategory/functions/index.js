
import { parse } from "url";
import prisma from "../../../../../../prisma/prismaClient";

export const getAllSubCategory = async (request) => {
    const { query } = parse(request.url, true);

    let limit = parseInt(query?.limit) || 10
    let page = parseInt(query?.page) - 1 || 0
    let offset = page * limit;

    let count;
    let list;

    count = await prisma.subCategory.count({
        where: {
            isBlocked: false,
        },
    });

    list = await prisma.subCategory.findMany({
        where: {
            isBlocked: false,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
    });

    if (!list) {
        const data = {
            st: false,
            data: [],
            msg: "No subCategory found",
        }
        return data
    }
    const data = {
        st: true,
        limit: limit,
        current_page: parseInt(query.page),
        total_pages: Math.ceil(count / limit),
        data: list,
        msg: "all subCategory fetched successfully",
    }

    return data
}




