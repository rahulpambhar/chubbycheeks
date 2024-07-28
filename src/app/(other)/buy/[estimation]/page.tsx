"use client";

import { Fragment, useEffect, useState } from 'react'
import { RedirectType, useRouter, useSearchParams, } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import axios from 'axios';
import ProductPreview from "@/components/ProductPreview";
import { Product } from '../../../../../types/global';
// import OTPInputGroup from '@/components/frontside/otp/page';
import Image from 'next/image';
import Script from 'next/script';
import ThankingMsg from "@/components/frontside/ThankingMsg/page"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function Checkout({ params }: { params: { estimation: string } }) {


    const { data: session, status }: any = useSession();
    let [subTotal, setSubTotal] = useState(0)
    const [taxableAmtTotal, setTaxableTotal] = useState(0)

    const [totalDiscount, setDiscountTotal] = useState(0)
    const [gstTotal, setGat] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [loader, setLoader] = useState(false)
    const [thankingMsg, setThankingMsg] = useState(false)

    const dispatch = useAppDispatch();
    const router = useRouter()
    const id = params?.estimation;

    const [order_, setOrder]: any = useState([])


    useEffect(() => {
        setSubTotal(
            order_?.reduce((acc: any, item: any) => {
                let subTotalAmt = item?.price * item?.qty
                return acc + subTotalAmt
            }, 0)
        )

        setTaxableTotal(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0

                if (item?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.price * item?.qty - ((item?.price * item?.qty) * item?.discount / 100)
                } else {

                    taxableAmount = ((item?.price - item?.discount) * item?.qty)
                }
                return acc + taxableAmount
            }, 0)
        )
        setDiscountTotal(
            order_?.reduce((acc: any, item: any) => {
                let discount = 0


                if (item?.discountType === "PERCENTAGE") {

                    discount = (item?.price * item?.qty) * item?.discount / 100
                } else {
                    discount = item?.discount
                }
                return acc + discount
            }, 0)
        )
        setGat(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0
                let gstTotal = 0

                if (item?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.price * item?.qty - ((item?.price * item?.qty) * item?.discount / 100)
                    gstTotal = taxableAmount * item?.gst / 100

                } else {

                    taxableAmount = ((item?.price - item?.discount) * item?.qty)
                    gstTotal = taxableAmount * item?.gst / 100
                }
                return acc + gstTotal
            }, 0)
        )

        setTotalAmount(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0
                let netAmount = 0

                if (item?.discountType === "PERCENTAGE") {

                    taxableAmount = item?.price * item?.qty - ((item?.price * item?.qty) * item?.discount / 100)
                    netAmount = taxableAmount * item?.gst / 100 + taxableAmount
                } else {

                    taxableAmount = ((item?.price - item?.discount) * item?.qty)
                    netAmount = taxableAmount * item?.gst / 100 + taxableAmount
                }
                return acc + netAmount
            }, 0)
        )
    }, [order_])



    useEffect(() => {
        !session ? () => { return router.push('/') } : null
        const getProducts = async () => {
            let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getProduct/products?id=${id}`);
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

                {
                    thankingMsg ? <ThankingMsg /> :
                        order_.length > 0 ?
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">Order Summary</h3>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-800">
                                        <ScrollArea className="h-[350px] w-auto rounded-md border">

                                            {session && order_?.length > 0 ?
                                                order_?.map((item: any, i: number) => (
                                                    <>
                                                        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                                            <div className="flex items-center space-x-4">

                                                                <div className="w-16 h-16 rounded-md overflow-hidden">
                                                                    <Image height={100} width={100} alt="Product image" className="object-cover w-full h-full" src={`/products/${item?.image[0]}`} />
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
                                                            <div className=" items-center">
                                                                <div className="font-medium">${item?.price * item?.qty}</div>
                                                                <h6 className="font-medium">{item?.discountType === "PERCENTAGE" ? `${item?.discount}% Off` : `$${item?.discount} Off`}</h6>
                                                            </div>

                                                        </div>
                                                        <Separator className="my-2" />
                                                    </>
                                                )) : "No data found"
                                            }
                                        </ScrollArea>
                                        {
                                            <>
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
                                                    <div>Total Amount</div>
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
                                                disabled={loader}
                                                onClick={async () => {
                                                    try {

                                                        setLoader(true)

                                                        const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty }], paymentMethod: "Prepaid" }
                                                        const tempData = await dispatch(createTempOrderFunc(orderMeta))

                                                        if (tempData?.payload.st) {
                                                            // successToast("Temp order done!")

                                                            const options = {
                                                                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                                                                key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
                                                                amount: tempData?.payload?.data?.amount,
                                                                currency: tempData?.payload?.data?.currency,
                                                                order_receipt: tempData?.payload?.data?.id,
                                                                name: process.env.NEXT_PUBLIC_APP_NAME,
                                                                description: "test",
                                                                image: "/image/chubbyCheeks/logo.png",
                                                                handler: async function (response: any) {
                                                                    const paymentId = response.razorpay_payment_id;

                                                                    const orderInfo = {
                                                                        temOrdrId: tempData?.payload?.temOrdrId,
                                                                        paymentId,
                                                                        repeatOrder: true
                                                                    }
                                                                    try {
                                                                        const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
                                                                        data.st ? successToast(data.msg) : errorToast(data.msg);
                                                                        setThankingMsg(true)
                                                                    } catch (error: any) {
                                                                        console.log('error::: ', error);
                                                                        errorToast("Something went wrong!!!");
                                                                    }
                                                                },
                                                                theme: {
                                                                    color: "#000000"
                                                                }
                                                            }

                                                            if (typeof window !== "undefined" && (window as any).Razorpay) {
                                                                const rzp1 = new (window as any).Razorpay(options);
                                                                rzp1.open();
                                                                setLoader(false)
                                                            } else {
                                                                errorToast("Razorpay SDK not loaded");
                                                                setLoader(false)
                                                            }

                                                        } else {
                                                            errorToast(tempData.payload.msg)
                                                            setLoader(false)
                                                        }
                                                    } catch (error) {
                                                        console.log('error::: ', error);
                                                        errorToast("Something went wrong!!")
                                                    }
                                                }}
                                                className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                            >
                                                ONLINE PAY
                                            </button>

                                            <button
                                                onClick={async () => {
                                                    try {
                                                        setLoader(true)
                                                        const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty }], paymentMethod: "COD" }
                                                        const tempData = await dispatch(createTempOrderFunc(orderMeta))

                                                        if (tempData?.payload.st) {
                                                            const orderInfo = {
                                                                temOrdrId: tempData?.payload?.temOrdrId,
                                                                paymentId: "",
                                                                repeatOrder: true
                                                            }
                                                            try {
                                                                const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
                                                                data.st ? successToast(data.msg) : errorToast(data.msg);
                                                                setLoader(false)
                                                                setThankingMsg(true)


                                                            } catch (error: any) {
                                                                console.log('error::: ', error);
                                                                errorToast("Something went wrong!!!");
                                                                setLoader(false)
                                                            }

                                                        } else {
                                                            errorToast(tempData.payload.msg)
                                                            setLoader(false)
                                                        }
                                                    } catch (error) {
                                                        console.log('error::: ', error);
                                                        errorToast("Something went wrong!!")
                                                    }
                                                }}
                                                className="w-full max-w-xs ml-auto mt-2 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                            >
                                                CASH ON DELIVERY
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
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* <ProductPreview openPreview={openPreview} setOpenPreview={setOpenPreview} product={priview} /> */}
        </div >
    );
};

