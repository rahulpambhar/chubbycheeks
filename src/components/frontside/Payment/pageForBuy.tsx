import React, { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema } from "../../../app/utils"
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button'
import { errorToast, successToast } from '@/components/toster'
import { useAppSelector, useAppDispatch } from "../../../app/redux/hooks";
import { createTempOrderFunc, createOrderFunc, getOrdersFunc, } from "../../../app/redux/slices/orderSlices";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import PaymentFields from './paymentFields'

const Payment = ({ setThankingMsg, order_, checkSizes, returnOrder, productSize, setProductSize

}: {
    setThankingMsg: any, order_: any; checkSizes: any; returnOrder: any; productSize: string, setProductSize: any
}) => {
    const { data: session, status }: any = useSession();

    const [loader, setLoader] = useState(false);


    const dispatch = useAppDispatch();

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            name: session?.user?.name, mobile: session?.user?.mobile, country_code: session?.user?.country_code, address: session?.user?.address, city: session?.user?.city, country: session?.user?.country, state: session?.user?.state, pincode: session?.user?.pincode, paymentMethod: 'Prepaid',
        },
    });


    const onSubmit = async (data: any) => {

        try {
            setLoader(true)

            const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty, checked: true, size: productSize }], data }
            const isSizes: any = checkSizes(orderMeta?.selectedItems)

            if (!isSizes.st) {
                errorToast(isSizes.msg);
                setLoader(false)
                return
            }


            if (data?.paymentMethod === "Prepaid") {
                const tempData = await dispatch(createTempOrderFunc(orderMeta))

                if (tempData?.payload.st) {

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
                                setProductSize("NONE")
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

            } else {

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
                        setProductSize("NONE")
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
            }
        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
            setLoader(false)
        }
    };
    return (
        <div className="">
            <Form {...form}  >
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <PaymentFields form={form} returnOrder={returnOrder} />

                    {
                        session &&
                        <div className=" grid gap-4 m-4 justify-center">

                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Choose payment method...</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <div className='grid grid-cols-2 gap-2 '>
                                                    <FormItem className=" flex  items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="Prepaid" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            PREPAID
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="COD" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            COD
                                                        </FormLabel>
                                                    </FormItem>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    }
                    <Button type='submit' disabled={loader} className="w-full max-w-xs sm:ml-20 md:ml-20 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900" >
                        PROCEED
                    </Button>
                </form>
            </Form>
        </div >
    )
}

export default Payment