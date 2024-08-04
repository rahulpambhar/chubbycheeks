import prisma from "../../../../prisma/prismaClient";


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
            return `${process.env.ORDER_PRFIX}-1`;
        } else if (typeOrder === "tempOrder") {
            return `${process.env.TEMP_ORDER_PRFIX}-1`;
        } else if (typeOrder === "returnOrder") {
            return `${process.env.RETURN_ORDER_PRFIX}-1`;
        }
    }

    if (typeOrder === "order") {
        let numericalPart = parseInt(lastInvoice?.invoiceNo.replace(`${process.env.ORDER_PRFIX}-`, ""));
        numericalPart++;
        inv = `${process.env.ORDER_PRFIX}-` + numericalPart.toString().padStart(0, '0');
    } else if (typeOrder === "tempOrder") {
        let numericalPart = parseInt(lastInvoice?.invoiceNo.replace(`${process.env.TEMP_ORDER_PRFIX}-`, ""));
        numericalPart++;
        inv = `${process.env.TEMP_ORDER_PRFIX}-` + numericalPart.toString().padStart(0, '0');
    } else if (typeOrder === "returnOrder") {
        let numericalPart = parseInt(lastInvoice?.invoiceNo.replace(`${process.env.RETURN_ORDER_PRFIX}-`, ""));
        numericalPart++;
        inv = `${process.env.RETURN_ORDER_PRFIX}-` + numericalPart.toString().padStart(0, '0');
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


export const calculateExpectedDeliveryDate = (daysFromNow) => {
    const now = new Date();
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(now.getDate() + daysFromNow);
    return expectedDeliveryDate;
};