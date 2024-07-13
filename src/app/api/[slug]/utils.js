import prisma from "../../../../prisma/prismaClient";
import { orderPrifix, tempOrderPrifix } from "../../../../env"


export const getProduct = async (productId) => {
    const products = await prisma.products.findFirst({
        where: {
            id: productId,
            isBlocked: false,
            qty: {
                gt: 0
            }
        },
    });
    if (!products) {
        return null
    }
    return products;
}

export const getCart = async (userId) => {
    try {
        let isCart = await prisma.cart.findFirst({
            where: {
                userId: userId,
                isBlocked: false,
            },
            include: {
                CartItem: {
                    where: { isBlocked: false },
                    include: {
                        product: { where: { isBlocked: false } }
                    }
                }
            }
        });

        if (!isCart) {
            return null
        }
        return isCart;
    } catch (err) {
        console.log('err::: ', err);
    }
}

export const getCartItem = async (cartId, productId) => {
    const isItemExist = await prisma.cartItem.findFirst({
        where: {
            cartId,
            productId,
            isBlocked: false
        }
    });
    if (!isItemExist) {
        return null
    }
    return isItemExist;
}

export const getNextInvoice = async (typeOrder) => {
    let inv = "";

    const lastInvoice = await prisma[typeOrder].findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!lastInvoice) {
        if (typeOrder === "order") {
            return `${orderPrifix}-1`;
        } else {
            return `${tempOrderPrifix}-1`;
        }
    }

    if (typeOrder === "order") {
        let numericalPart = parseInt(lastInvoice?.invoiceNo.replace(`${orderPrifix}-`, ""));
        numericalPart++;
        inv = `${orderPrifix}-` + numericalPart.toString().padStart(0, '0');
    } else {
        let numericalPart = parseInt(lastInvoice?.invoiceNo.replace(`${tempOrderPrifix}-`, ""));
        numericalPart++;
        inv = `${tempOrderPrifix}-` + numericalPart.toString().padStart(0, '0');
    }
    return inv;
}

export async function activityLog(action, table, body, createdBy) {
    try {
        await prisma.activityLog.create({ data: { action, table, body, createdBy } });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

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

