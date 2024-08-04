
import axios from "axios";
import prisma from "../../../../../../../prisma/prismaClient";
import { parse } from "url";


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

const formatDateString = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const shiproketReturnOrder = async (body) => {
    try {

        const { id, orderStatus, data: orderData, session } = body

        const returnOrder = await prisma.returnOrder.findUnique({
            where: {
                id,
                isBlocked: false,
                orderStatus: 'ACCEPTED'
            },
            include: {
                items: {
                    where: {
                        isBlocked: false
                    },
                    include: {
                        product: true,
                    }
                },
                order: true,
                user: true,
            },
        });


        const order_items = returnOrder?.items.map((item) => {
            const total = item?.qty * item?.product?.price
            const discount = item?.product?.discount
            let discountAmount = 0;

            if (item?.product?.discountType === "PERCENTAGE") {
                discountAmount = total * discount / 100

            } else {
                discountAmount = item?.qty * discount
            }

            return {
                "sku": item?.product?.sku,
                "name": item?.product?.name,
                "units": item?.qty,
                "selling_price": item?.product?.price || 0,
                "discount": discountAmount,
                "brand": item?.product?.brand,
                "qc_enable": false,
                "hsn": item?.product?.hsn,
                "qc_size": item?.size
            }
        });

        const data = {
            "order_id": returnOrder?.id,
            "order_date": formatDateString(returnOrder?.invoiceDate),
            "channel_id": "",
            "pickup_customer_name": returnOrder?.user?.name,
            "pickup_last_name": "",
            "company_name": "Dummy Company",
            "pickup_address": returnOrder?.order?.address,
            "pickup_address_2": "",
            "pickup_city": returnOrder?.order?.city,
            "pickup_state": returnOrder?.order?.state,
            "pickup_country": returnOrder?.order?.country,
            "pickup_pincode": returnOrder?.order?.pincode,
            "pickup_email": returnOrder?.user?.email,
            "pickup_phone": returnOrder?.user?.mobile,
            "pickup_isd_code": returnOrder?.user?.country_code,

            "shipping_customer_name": "Rahul",
            "shipping_last_name": "Pambhar",
            "shipping_address": "12, nilkanth Avenue, sarjan road, nr. abc circle, sudama chowk, Motavarachha",
            "shipping_address_2": "",
            "shipping_city": "surat",
            "shipping_country": "India",
            "shipping_pincode": 394101,
            "shipping_state": "Gujarat",
            "shipping_email": "pambharrahul@gmail.com",
            "shipping_isd_code": "91",
            "shipping_phone": 8000555268,

            "order_items": order_items,
            "payment_method": "COD",
            "total_discount": returnOrder?.discountAmount,
            "sub_total": returnOrder?.total,
            "length": orderData?.length,
            "breadth": orderData?.breadth,
            "height": orderData?.height,
            "weight": orderData?.weight
        }

        const getShiproketAuthToken = await prisma.shiprocket_Auth.findUnique({ where: { id: process.env.SHIPROKET_AUTH_DB_ID } })

        const shiproketReturnOrder = await axios.post(`${process.env.SHIPROKET_URL}/orders/create/return`, data, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getShiproketAuthToken?.token}`
            }
        })

        if (shiproketReturnOrder?.data?.status !== "RETURN PENDING") {
            return { st: false, data: {}, msg: shiproketReturnOrder?.data?.msg }
        }

        await prisma?.order.update({
            where: { id: returnOrder?.order?.id },
            data: { orderStatus: "RETURNED" }
        })

        return { st: true, data: shiproketReturnOrder?.data, msg: "Return Order Placed" }
    } catch (error) {
        console.log('error::: ', error);
        return { st: false, data: [], msg: "something went wrong!!" }
    }

}

export const getReturnOrdersById = async (request) => {
    const { query } = parse(request.url, true);
    const { search = '' } = query;

    try {
        const order = await prisma.returnOrder.findUnique({
            where: {
                id: search
            },
            include: {
                items: {
                    where: {
                        isBlocked: false
                    },
                    include: {
                        product: true,
                    }
                },
                user: true,
            },
        });

        if (!order) { return { st: false, data: [], msg: "No Order found" }; }
        return { st: true, data: order, msg: "Order fetched successfully" };
    } catch (error) {
        console.log('error::: ', error);
        return { st: false, data: [], msg: "something went wrong!!" }
    }





}