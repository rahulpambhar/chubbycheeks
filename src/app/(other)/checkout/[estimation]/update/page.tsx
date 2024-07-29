"use client";

import { Fragment, useEffect, useState } from 'react'
import { RedirectType, useRouter, useSearchParams, } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc, updateOrdersFunc } from '../../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import axios from 'axios';
import { truncate } from 'fs';
import { actionTocartFunction_ } from '@/components/Cart';
import { fetchCategories } from "../../../../redux/slices/categorySlice";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { addYears, setHours, setMinutes, setSeconds, setMilliseconds, addDays, format } from "date-fns";
import Script from 'next/script';
import { getCurrentDateFormatted } from '@/app/utils'
import { fetchCart } from '@/app/redux/slices/cartSclice';
import Cart from '@/components/Cart';
import { DateRange } from "react-day-picker"


export default function Checkout({ params }: { params: { estimation: string } }) {
    const { data: session, status }: any = useSession();
    const [subTotal, setSubTotal] = useState(0)
    const [taxableAmtTotal, setTaxableTotal] = useState(0)

    const [totalDiscount, setDiscountTotal] = useState(0)
    const [gstTotal, setGat] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const [date, setDate] = useState<DateRange | undefined>({ from: oneMonthAgo, to: today, })

    const preserveTime = (date: any, referenceDate: any) => {
        return setMilliseconds(setSeconds(setMinutes(setHours(date, referenceDate.getHours()), referenceDate.getMinutes()), referenceDate.getSeconds()), referenceDate.getMilliseconds());
    };

    const dispatch = useAppDispatch();

    const getOrders = async () => await dispatch(getOrdersFunc({ page: 1, limit: 1000, search: "", from: date?.from?.toString(), to: date?.to?.toString(), slug: "getAll", }))
    const searchParams = useSearchParams()

    const router = useRouter()
    const orderID: string | null = searchParams.get('orderID')
    const id = params?.estimation;
    let productForBuy: any = useAppSelector(
        (state): any => state?.categories?.products?.find((item: any) => item.id === id)
    );

    productForBuy = [{ ...productForBuy, checked: true }]

    const [order_, setOrder]: any = useState([])
    const order = orderID ? useAppSelector((state) => state?.orderReducer?.orders?.find((order: any) => order.id === orderID)?.OrderItem) : useAppSelector((state) => state?.cartReducer?.cartItem) || [];
    const isLoading = useAppSelector((state) => state?.cartReducer?.loading);

    useEffect(() => {
        orderID ? setOrder(order?.map((item: any) => ({ ...item, checked: true }))) : setOrder(order)
    }, [order])

    useEffect(() => {
        setSubTotal(
            order_?.reduce((acc: any, item: any) => {
                let subTotalAmt = item?.product?.price * item?.qty
                return item.checked ? acc + subTotalAmt : acc + 0
            }, 0)
        )

        setTaxableTotal(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0

                if (item?.product?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.product?.price * item?.qty - ((item?.product?.price * item?.qty) * item?.product?.discount / 100)
                } else {

                    taxableAmount = ((item?.product?.price - item?.product?.discount) * item?.qty)
                }
                return item.checked ? acc + taxableAmount : acc + 0
            }, 0)
        )
        setDiscountTotal(
            order_?.reduce((acc: any, item: any) => {
                let discount = 0


                if (item?.product?.discountType === "PERCENTAGE") {

                    discount = (item?.product?.price * item?.qty) * item?.product?.discount / 100
                } else {
                    discount = item?.product?.discount
                }
                return item.checked ? acc + discount : acc + 0
            }, 0)
        )
        setGat(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0
                let gstTotal = 0

                if (item?.product?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.product?.price * item?.qty - ((item?.product?.price * item?.qty) * item?.product?.discount / 100)
                    gstTotal = taxableAmount * item?.product?.gst / 100

                } else {

                    taxableAmount = ((item?.product?.price - item?.product?.discount) * item?.qty)
                    gstTotal = taxableAmount * item?.product?.gst / 100
                }
                return item.checked ? acc + gstTotal : acc + 0
            }, 0)
        )

        setTotalAmount(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0
                let netAmount = 0

                if (item?.product?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.product?.price * item?.qty - ((item?.product?.price * item?.qty) * item?.product?.discount / 100)
                    netAmount = taxableAmount * item?.product?.gst / 100 + taxableAmount
                } else {

                    taxableAmount = ((item?.product?.price - item?.product?.discount) * item?.qty)
                    netAmount = taxableAmount * item?.product?.gst / 100 + taxableAmount
                }
                return item.checked ? acc + netAmount : acc + 0
            }, 0)
        )
    }, [order_])

    useEffect(() => {
        !session ? () => { return router.push('/') } : null
        getOrders()
    }, [])

    const toggleSelect = (id: any, index: number) => {
        setOrder(order_.map((item: any) => { return item.id === id ? { ...item, checked: !item.checked } : item }))
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch, id]);

    return (
        <>
            <div className="flex flex-col min-h-screen py-12 md:py-24 items-center justify-start space-y-4">
                <div className="w-full max-w-2xl px-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Update Order</h3>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-800">
                                <ScrollArea className="h-[350px] w-auto rounded-md border">
                                    <div className="p-4">

                                        {session && order_?.length > 0 ? order_?.map((item: any, i: number) => (
                                            <>

                                                <div key={item.id} className="flex items-center justify-between text-sm ">
                                                    <div className="flex items-center space-x-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={item?.checked}
                                                            onChange={() => {
                                                                if (orderID) {
                                                                    toggleSelect(item.id, i)
                                                                }
                                                            }}
                                                        />
                                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                                            <Image height={100} width={100} alt="Product image" className="object-cover w-full h-full" src={`/products/${item?.product?.image[0]}`} />
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="font-medium">{item?.product?.name}</div>
                                                            <div className="text-gray-500 dark:text-gray-400">₹{orderID ? item?.product?.price : item?.product?.price} x {item?.qty}</div>
                                                        </div>

                                                        {item.checked &&
                                                            <div className=" justify-center items-center space-x-2">

                                                                <Button className='bg-green-200  h-[5px] w-[5px] rounded-sm' disabled={isLoading} onClick={() => {
                                                                    const updatedItems: any = order_.map((o: any) => {
                                                                        const orderQty = order?.find((val: any) => val.id === item.id)?.qty || 0;
                                                                        if (o.id === item.id) {
                                                                            return { ...o, qty: o.qty + 1 };
                                                                        }
                                                                        return o;
                                                                    });
                                                                    setOrder(updatedItems);
                                                                }}>+</Button>
                                                                <h1>{item.qty}</h1>
                                                                <Button className=' bg-red-200  h-[5px] w-[5px] rounded-sm' disabled={isLoading} onClick={() => {
                                                                    const updatedItems: any = order_.map((o: any) => {
                                                                        if (o.id === item.id && o.qty > 1) {
                                                                            return { ...o, qty: o.qty - 1 };
                                                                        }
                                                                        return o;
                                                                    });
                                                                    setOrder(updatedItems);
                                                                }}>-</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="font-medium"> ₹ {item?.product?.price * item.qty}</div>
                                                    </div>
                                                </div>

                                                <Separator className="my-2" />
                                            </>
                                        )) : "NO ITEMS FOUND"}
                                    </div>
                                </ScrollArea>
                                {<>
                                    <div className="flex items-center justify-between px-4">
                                        <div>Sub Total  </div>
                                        <div> ₹ {subTotal}</div>
                                    </div>

                                    <div className="flex items-center justify-between px-4">
                                        <div> Discount </div>
                                        <div> ₹ {totalDiscount}</div>
                                    </div>
                                    <div className="flex items-center justify-between px-4">
                                        <div>Taxable Amount </div>
                                        <div> ₹ {taxableAmtTotal}</div>
                                    </div>

                                    <div className="flex items-center justify-between px-4">
                                        <div>Gst</div>
                                        <div> ₹ {gstTotal}</div>
                                    </div>
                                    <div className="flex items-center justify-between px-4">
                                        <div>{orderID ? "Checked Total" : "Total Amount"}</div>
                                        <div> ₹ {totalAmount}</div>
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">Shipping information</h3>
                                </div>
                                <div className="p-4">
                                    <div className="text-sm">
                                        <div className="font-medium">{session?.user?.name}</div>
                                        <div>{session?.user?.address}</div>
                                        <div>{session?.user?.city}</div>
                                        <div>{session?.user?.country}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="border hi border-gray-200 dark:border-gray-800 rounded-lg">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">Order information</h3>
                                </div>
                                <div className="p-4">
                                    <div className="text-sm">
                                        <div className="grid gap-2">
                                            <label className="font-medium" htmlFor="name">
                                                Name
                                            </label>
                                            <input className="input" id="name" placeholder="Enter your name" type="text" />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="font-medium" htmlFor="card">
                                                Card number
                                            </label>
                                            <input className="input" id="card" placeholder="Enter your card number" type="password" />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="grid gap-2">
                                                <label className="font-medium" htmlFor="expiry">
                                                    Expiry date
                                                </label>
                                                <input className="input" id="expiry" placeholder="MM/YY" type="text" />
                                            </div>
                                            <div className="grid gap-2">
                                                <label className="font-medium" htmlFor="cvv">
                                                    CVV
                                                </label>
                                                <input className="input" id="cvv" placeholder="Enter your CVV" type="password" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                session &&
                                <div>

                                    <button
                                        onClick={async () => {
                                            try {
                                                let orderMeta: any = {
                                                    selectedItems: order_.map((item: any, index: number) => {
                                                        if (item.checked === true) {
                                                            return { productId: item.product.id, qty: item.qty, };
                                                        }
                                                        return null;
                                                    }).filter(Boolean)
                                                }
                                                if (orderMeta.selectedItems.length === 0) {
                                                    errorToast("Please select atleast one item to proceed")
                                                    return
                                                }

                                                const res: any = await dispatch(updateOrdersFunc({ id: orderID, data: orderMeta, orderStatus: "UPDATE" }))

                                                res?.payload?.st ? successToast(res?.payload?.msg) : errorToast(res?.payload?.msg);

                                            } catch (error) {
                                                console.log('error--> ', error);
                                                errorToast("Something went wrong!!!")
                                            }
                                        }}
                                        className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                    >
                                        Update Order
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Cart />
            </div >
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </>
    );
};
