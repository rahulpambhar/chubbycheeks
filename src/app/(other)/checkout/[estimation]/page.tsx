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
import { fetchCategories } from "../../../redux/slices/categorySlice";


export default function Checkout({ params }: { params: { estimation: string } }) {

    // let [OTP, setOTP] = useState(false)
    // let [timer, setTimer] = useState(false)
    // const [timeInSeconds, setTimeInSeconds] = useState(60);
    // const [intervalId_, setClearInterval] = useState(0);
    // const [Msg, setMsg] = useState("")
    const { data: session, status }: any = useSession();
    let [subTotal, setSubTotal] = useState(0)
    const [openPreview, setOpenPreview] = useState(false);
    const [priview, sePriview] = useState < Product > ({} as Product)
    const [repeatOrder, setRepeatOrder] = useState(true);
    const [returnOrder, setReturnOrder] = useState(false);
    const [returnOrderDisabled, setReturnOrderDisabled] = useState(true);

    const dispatch = useAppDispatch();
    const actionTocartFunction = (item: any, action: any) => actionTocartFunction_(item, action, dispatch)

    const getOrders = async () => await dispatch(getOrdersFunc())
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

    const toggleSelect = (id: any, index: number) => {
        setOrder(order_.map((item: any) => { return item.id === id ? { ...item, checked: !item.checked } : item }))
    };

    useEffect(() => {
        setSubTotal(
            order_?.reduce((acc: any, item: any) => {
                return item.checked ? acc + (item?.product?.price * item?.qty) : acc + 0
            }, 0)
        );
    }, [order_])

    useEffect(() => {
        !session ? () => { return router.push('/') } : null
        getOrders()
    }, [])


    const toggleRepeatOrder = () => {
        setRepeatOrder(true);
        setReturnOrder(false);
        setOrder(order_?.map((item: any) => {
            return { ...item, checked: true }
        }))
    };

    const toggleReturnOrder = () => {
        setRepeatOrder(false);
        setReturnOrder(true);
        setOrder(order?.map((item: any) => {
            return { ...item, checked: false }
        }))
    };

    useEffect(() => {
        if (orderID) {
            const isReturnOrderFunc = async () => {
                const response = await axios.get(`${apiUrl}/return/returnOrder?orderID=${orderID}`);
                if (!response.data.st) {
                    setReturnOrderDisabled(false);
                }
            }
            isReturnOrderFunc()
        }
    }, [orderID])

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch, id]);

    // const [inputValues, setInputValues] = useState({
    //     input1: '',
    //     input2: '',
    //     input3: '',
    //     input4: '',
    //     input5: '',
    //     input6: '',
    // });

    // const generateOTP = async () => {
    //     try {
    //         const response = await axios.post(`${apiUrl}/sendOTP/otp`);
    //         if (response.data.st) {
    //             setOTP(true);
    //             const intervalId = setInterval(() => {
    //                 setTimeInSeconds(prevTime => prevTime - 1);
    //             }, 1000);
    //             setTimer(true)
    //             setClearInterval(intervalId)
    //             setMsg("")
    //         } else {
    //             errorToast(response.data.msg);
    //         }

    //     } catch (error) {
    //         console.log('error::: ', error);
    //         errorToast("Something went wrong!!")
    //     }
    // }

    // const destroyOtp = async () => {
    //     try {
    //         await axios.put(`${apiUrl}/destroyOtp/otp`);

    //     } catch (error) {
    //         console.log('error::: ', error);
    //     }
    // }

    // useEffect(() => {
    //     if (timeInSeconds <= 0) {
    //         clearInterval(intervalId_)
    //         setTimeInSeconds(60)
    //         setTimer(false)
    //         destroyOtp()

    //     } else if (!OTP) {
    //         clearInterval(intervalId_)
    //         setTimeInSeconds(60)
    //         setTimer(false)
    //         destroyOtp()
    //     }
    // }, [timeInSeconds]);

    // useEffect(() => {
    //     if (!timer) {
    //         setInputValues({
    //             input1: '',
    //             input2: '',
    //             input3: '',
    //             input4: '',
    //             input5: '',
    //             input6: '',
    //         });
    //         setMsg("")
    //     }
    // }, [timer])

    // useEffect(() => {
    //     window.addEventListener('beforeunload', destroyOtp());
    //     return () => {
    //         window.removeEventListener('beforeunload', destroyOtp());
    //     };
    // }, []);

    // const minutes = Math.floor(timeInSeconds / 60);
    // const seconds = timeInSeconds % 60;

    // const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return (
        <div className="flex flex-col min-h-screen py-12 md:py-24 items-center justify-start space-y-4">
            <div className="w-full max-w-2xl px-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">Order Summary</h3>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-800">
                            {session && order_?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            checked={item?.checked}
                                            onChange={() => toggleSelect(item.id, i)} // Assuming item.id exists
                                        />
                                        <div className="w-16 h-16 rounded-md overflow-hidden">
                                            <img alt="Product image" className="object-cover w-full h-full" src="/placeholder.svg" />
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium">{item?.product?.name}</div>
                                            <div className="text-gray-500 dark:text-gray-400">${orderID ? item?.product?.price : item?.product?.price} x {item?.qty}</div>
                                        </div>

                                        {item.checked &&
                                            <div className="flex items-center space-x-2">
                                                <button disabled={isLoading} onClick={() => {
                                                    const updatedItems: any = order_.map((o: any) => {
                                                        if (o.id === item.id && o.qty > 1) {
                                                            if (!orderID) {
                                                                actionTocartFunction(order[i], "remove")
                                                            } else {
                                                                return { ...o, qty: o.qty - 1 };
                                                            }
                                                        }
                                                        return o;
                                                    });
                                                    setOrder(updatedItems);
                                                }}>-</button>
                                                <span>{item.qty}</span>
                                                <button disabled={isLoading} onClick={() => {
                                                    const updatedItems: any = order_.map((o: any) => {
                                                        const orderQty = order?.find((val: any) => val.id === item.id)?.qty || 0;
                                                        if (o.id === item.id) {
                                                            if (orderID && returnOrder && orderQty > item.qty) {
                                                                return { ...o, qty: o.qty + 1 };
                                                            } else if (orderID && repeatOrder) {
                                                                return { ...o, qty: o.qty + 1 };
                                                            } else if (!orderID) {
                                                                actionTocartFunction(item, "add")
                                                            }
                                                        }
                                                        return o;
                                                    });
                                                    setOrder(updatedItems);
                                                }}>+</button>
                                            </div>
                                        }
                                    </div>
                                    <div className="flex items-center">
                                        <div className="font-medium">${item?.product?.price * item.qty}</div>
                                    </div>
                                </div>
                            ))}
                            {
                                <div className="flex items-center justify-between p-4">
                                    <div>{orderID ? "Checked Subtotal" : "Subtotal"}</div>
                                    <div>${subTotal}</div>
                                </div>
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
                                {
                                    orderID && <div>
                                        <button onClick={toggleRepeatOrder} style={{ color: repeatOrder ? 'green' : 'black' }}>
                                            Repeat Order
                                        </button>
                                        {!returnOrderDisabled && <button onClick={toggleReturnOrder} style={{ color: returnOrder ? 'red' : 'black' }}>
                                            Return Order
                                        </button>
                                        }
                                    </div>}
                                <button
                                    onClick={async () => {
                                        try {
                                            let orderMeta: any = {
                                                selectedItems: order_.map((item: any, index: number) => {
                                                    if (item.checked === true) {
                                                        return { productId: item.product.id, qty: item.qty };
                                                    }
                                                    return null;
                                                }).filter(Boolean)
                                            }

                                            if (orderMeta.selectedItems.length === 0) {
                                                errorToast("Please select atleast one item to proceed")
                                                return
                                            }

                                            if (!returnOrder) {
                                                const tempData = await dispatch(createTempOrderFunc(orderMeta))
                                                if (tempData?.payload.st) {
                                                    successToast("Temp order done!")
                                                    const data: any = await dispatch(createOrderFunc(tempData?.payload.temOrdrId))
                                                    data?.payload.st ? successToast(data?.payload.msg) : errorToast(data?.payload.msg)
                                                } else {
                                                    errorToast(tempData.payload.msg)
                                                }
                                            } else {
                                                const data = {
                                                    orderID: orderID,
                                                    selectedItems: orderMeta?.selectedItems
                                                }

                                                const response = await axios.post(`${apiUrl}/return/returnOrder`, data);
                                                if (response.data.st) {
                                                    successToast(response.data.msg)
                                                } else {
                                                    errorToast(response.data.msg)
                                                }
                                            }

                                        } catch (error) {
                                            console.log('error::: ', error);
                                            errorToast("Something went wrong!!")
                                        }
                                    }}
                                    className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                >
                                    {orderID ? "Proceed" : "Place Order"}
                                </button>
                            </div>
                        }
                        {
                            // ) : (
                            //     <>
                            //         <OTPInputGroup orderID={orderID} setOTP={setOTP} timer={timer} setMsg={setMsg} Msg={Msg} setInputValues={setInputValues} inputValues={inputValues} />
                            //         {
                            //             !timer ?
                            //                 <div>
                            //                     <button onClick={() => {
                            //                         setTimeInSeconds(60)
                            //                         generateOTP()
                            //                     }} >Generate New OTP</button>
                            //                     <div>Click the button if you haven't received the OTP</div>
                            //                 </div> : <> <h1>OTP Expires In</h1><div>{timerDisplay}</div></>
                            //         }
                            //     </>
                            // )
                        }


                    </div>
                </div>
            </div>
            {/* <ProductPreview openPreview={openPreview} setOpenPreview={setOpenPreview} product={priview} /> */}
        </div >
    );
};

