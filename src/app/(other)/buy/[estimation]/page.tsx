"use client";

import { Fragment, useEffect, useState } from 'react'
import { RedirectType, useRouter, useSearchParams, } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import axios from 'axios';
import ProductPreview from "@/components/ProductPreview";
import { Product } from '../../../../../types/global';
// import OTPInputGroup from '@/components/frontside/otp/page';
import { apiUrl } from '../../../../../env';
import { truncate } from 'fs';
import { actionTocartFunction_ } from '@/components/Cart';


export default function Checkout({ params }: { params: { estimation: string } }) {


    const { data: session, status }: any = useSession();
    let [subTotal, setSubTotal] = useState(0)
    const [openPreview, setOpenPreview] = useState(false);
    const [priview, sePriview] = useState<Product>({} as Product)

    const dispatch = useAppDispatch();
    const router = useRouter()
    const id = params?.estimation;

    const [order_, setOrder]: any = useState([])


    useEffect(() => {
        setSubTotal(
            order_?.reduce((acc: any, item: any) => {
                if (item?.discountType === "PERCENTAGE") {
                    return acc + (item?.price * item?.qty - ((item?.price * item?.qty) * item.discount / 100))
                } else {
                    return acc + ((item?.price - item?.discount) * item?.qty)
                }
            }, 0)
        );
    }, [order_])



    useEffect(() => {
        !session ? () => { return router.push('/') } : null
        const getProducts = async () => {
            let response = await axios.get(`${apiUrl}/getProduct/products?id=${id}`);
            const productForBuy = response.data;

            if (productForBuy?.st) {
                const productData = productForBuy.data;
                if (productData) {
                    productData.qty = 1;
                    setOrder([productData]);
                }
            } else {
                router.push('/');
            }
        }
        getProducts();
    }, [session]);

    return (
        <div className="flex flex-col min-h-screen py-12 md:py-24 items-center justify-start space-y-4">
            <div className="w-full max-w-2xl px-4">
                {order_.length > 0 ?
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Order Summary</h3>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-800">
                                {session && order_?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center space-x-4">

                                            <div className="w-16 h-16 rounded-md overflow-hidden">
                                                <img alt="Product image" className="object-cover w-full h-full" src="/placeholder.svg" />
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium">{item?.name}</div>
                                                <div className="text-gray-500 dark:text-gray-400">${item?.price} x {item?.qty}</div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => {
                                                    const updatedItems: any = order_.map((o: any) => {

                                                        if (o.qty <= 1) {
                                                            return { ...o, qty: 1 };
                                                        }
                                                        return { ...o, qty: o.qty - 1 };
                                                    });
                                                    setOrder(updatedItems);
                                                }}>-</button>
                                                <span>{item.qty}</span>
                                                <button onClick={() => {
                                                    const updatedItems: any = order_?.map((o: any) => {
                                                        return { ...o, qty: o?.qty + 1 };
                                                    });
                                                    setOrder(updatedItems);
                                                }}>+</button>
                                            </div>

                                        </div>
                                        <div className="flex items-center">
                                            <div className="font-medium">${item?.price * item?.qty}</div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between p-4">
                                    <div>Subtotal</div>
                                    <div>${subTotal}</div>
                                </div>

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
                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">Payment information</h3>
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
                                                const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty }] }
                                                const tempData = await dispatch(createTempOrderFunc(orderMeta))
                                                if (tempData?.payload.st) {
                                                    successToast("Temp order done!")
                                                    const data: any = await dispatch(createOrderFunc(tempData?.payload.temOrdrId))
                                                    data?.payload.st ? successToast(data?.payload.msg) : errorToast(data?.payload.msg)
                                                } else {
                                                    errorToast(tempData.payload.msg)
                                                }
                                            } catch (error) {
                                                console.log('error::: ', error);
                                                errorToast("Something went wrong!!")
                                            }
                                        }}
                                        className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    :
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="border-t border-gray-200 dark:border-gray-800">
                                Loading
                            </div>
                        </div>
                    </div>
                }
            </div>
            {/* <ProductPreview openPreview={openPreview} setOpenPreview={setOpenPreview} product={priview} /> */}
        </div >
    );
};

