import { parse } from "url";
import prisma from "../../../../../../../prisma/prismaClient";
import axios from "axios";
import authOptions from "../../../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";


export async function getOrders(id) {

    const orders = await prisma.order.findMany({
        where: {
            userId: id,
            isBlocked: false,
        },

        include: {
            OrderItem: {
                where: {
                    isBlocked: false
                },
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
    SHIPPED: 'SHIPPED',
    CANCELLED: 'CANCELLED',
    COMPLETE: 'COMPLETE',
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
    const { search = '' } = query;

    const order = await prisma.order.findUnique({
        where: {
            id: search
        },
        include: {
            OrderItem: {
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
    return order
}

export const shiproketLogin = async (request) => {

    const data = { email: process.env.SHIPROKET_AUTH_EMAIL, password: process.env.SHIPROKET_AUTH_PASS }
    const shiproketLogin = await axios.post(`${process.env.SHIPROKET_URL}/auth/login`, data, { headers: { 'Content-Type': 'application/json', }, })

    shiproketLogin && await prisma.shiprocket_Auth.update({
        where: { id: process.env.SHIPROKET_AUTH_DB_ID },
        data: { token: shiproketLogin?.data?.token, updatedAt: new Date() }
    })
    return shiproketLogin
}

const formatDateString = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const shiproketOrder = async (body) => {

    const { id, orderStatus, data: orderData } = body

    const order = await prisma.order.findUnique({
        where: {
            id,
            isBlocked: false,
            orderStatus: 'ACCEPTED'
        },
        include: {
            OrderItem: {
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

    const order_items = order?.OrderItem.map((item) => ({
        "name": item?.product?.name,
        "sku": item?.product?.sku,
        "units": item?.qty,
        "selling_price": 94 + 4.5,
        "discount": item?.OrderItem?.discount || 0,
        "tax": item?.OrderItem?.gst || 0,
        "hsn": item?.product?.hsn || ''
    }));
console.log('formatDateString::: ',formatDateString(order?.invoiceDate) ,order);

    const data = {
        "order_id": order?.id,
        "order_date": formatDateString(order?.invoiceDate),
        "pickup_location": "Primary",

        "channel_id": "",
        "comment": "",
        "reseller_name": "",
        "company_name": "",

        "billing_customer_name": order?.user?.name,
        "billing_last_name": "",
        "billing_address": order?.user?.address,
        "billing_address_2": "",
        "billing_isd_code": "",
        "billing_city": order?.user?.city,
        "billing_pincode": order?.user?.pincode,
        "billing_state": order?.user?.state,
        "billing_country": order?.user?.country,
        "billing_email": order?.user?.email,
        "billing_phone": order?.user?.mobile,
        "billing_alternate_phone": "",

        "shipping_is_billing": true,
        "shipping_customer_name": order?.user?.name,
        "shipping_last_name": "",
        "shipping_address": order?.user?.address,
        "shipping_address_2": "",
        "shipping_city": order?.user?.city,
        "shipping_pincode": order?.user?.pincode,
        "shipping_country": order?.user?.country,
        "shipping_state": order?.user?.state,
        "shipping_email": order?.user?.email,
        "shipping_phone": order?.user?.mobile,

        "order_items": order_items,
        "payment_method": "COD",
        "shipping_charges": 0, 
        "giftwrap_charges": 0, 
        "transaction_charges": 0, 
        "total_discount": 0,
        "sub_total": 94.5,
        "length": orderData?.length,
        "breadth": orderData?.breadth,
        "height": orderData?.height,
        "weight": orderData?.weight,
        "ewaybill_no": "",
        "customer_gstin": "",
        "invoice_number": "",
        "order_type": ""
    }

    const getShiproketAuthToken = await prisma.shiprocket_Auth.findUnique({ where: { id: process.env.SHIPROKET_AUTH_DB_ID } })

    const shiproketOrder = await axios.post(`${process.env.SHIPROKET_URL}/orders/create/adhoc`, data, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${getShiproketAuthToken?.token}`
        }
    })
    console.log('shiproketOrder::: ', shiproketOrder);
    
    if (shiproketOrder?.data?.status !== "NEW") {
        return { st: false, data: {}, msg: shiproketOrder?.data?.msg }
    }
    return { st: true, data: shiproketOrder?.data, msg: "Order Placed" }
}

export const shiproketCancelOrder = async (body) => {

    const { id, orderStatus } = body
    console.log('id::: ', id);
    const ids = []

    await Promise.all(
        id.map(async (item) => {
            const order = await prisma.shiprockeOrders.findFirst({
                where: {
                    channel_order_id: item,
                    isBlocked: false
                },
                select: {
                    order_id: true
                }
            });
            ids?.push(order?.order_id)

            return order;
        })
    );

    const data = { ids }

    const getShiproketAuthToken = await prisma.shiprocket_Auth.findUnique({ where: { id: process.env.SHIPROKET_AUTH_DB_ID } })


    const cancelShiproketOrder = await axios.post(`${process.env.SHIPROKET_URL}/orders/cancel`, data, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${getShiproketAuthToken?.token}`
        }
    })

    if (cancelShiproketOrder?.data?.status_code !== 200) {
        return { st: false }
    }
    return { st: true, data: cancelShiproketOrder?.data }
}


export const cancelOrder = async (body) => {
    let session = await getServerSession(authOptions);
    const { id, data, orderStatus, } = body
    

    const TEN_DAYS_IN_SECONDS = 86400 * 10;

    const res = await prisma.shiprocket_Auth.findFirst({
        where: {
            id: process.env.SHIPROKET_AUTH_DB_ID
        }
    })

    const updatedAt = new Date(res.updatedAt);
    const currentDate = new Date();
    const timeDifference = (currentDate - updatedAt) / 1000;

    if (timeDifference > TEN_DAYS_IN_SECONDS) {

        const isShiproketLogin = await shiproketLogin()
        if (!isShiproketLogin) {
            return { st: false, data: [], msg: "Shiproket login failed!", }
        }

        const setShiproketCancelOrder = await shiproketCancelOrder(body)

        if (setShiproketCancelOrder?.st === false) {
            return { st: false, data: [], msg: setShiproketCancelOrder?.msg, }
        }

        await Promise.all(
            id.map(async (item) => {
                await prisma.order.update({
                    where: { id: item, isBlocked: false }, data: { orderStatus: orderStatus, updatedBy: session?.user?.id, cancelledAt: new Date() }
                })

            })
        );

        return { st: true, data: [], msg: "order updated successfully!", };

    } else {
        const setShiproketCancelOrder = await shiproketCancelOrder(body)

        if (setShiproketCancelOrder?.st === false) {
            return { st: false, data: [], msg: setShiproketCancelOrder?.msg, }
        }

        await Promise.all(
            id.map(async (item) => {
                await prisma.order.update({
                    where: { id: item, isBlocked: false }, data: { orderStatus: orderStatus, updatedBy: session?.user?.id, cancelledAt: new Date() }
                })

            })
        );

        return { st: true, data: [], msg: "order updated successfully!", }
    }
}