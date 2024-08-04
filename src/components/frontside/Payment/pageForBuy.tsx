import React, { useEffect, useState } from 'react'
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
import axios from 'axios'
import OTPInputGroup from '@/components/frontside/changePasswordOtp/page';

const Payment = ({ OTP, setOTP, setThankingMsg, order_, checkSizes, returnOrder, productSize, setProductSize }: {
    setThankingMsg: any, order_: any; checkSizes: any; returnOrder: any; productSize: string, setProductSize: any; OTP: any, setOTP: any,
}) => {
    const { data: session, status }: any = useSession();

    const [loader, setLoader] = useState(false);

    let [timer, setTimer] = useState(false)
    const [timeInSeconds, setTimeInSeconds] = useState(60);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isVerifyOTP, setVerifyOTP] = useState({ st: false, msg: "" });

    const dispatch = useAppDispatch();

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            name: session?.user?.name, mobile: session?.user?.mobile, country_code: session?.user?.country_code, address: session?.user?.address, city: session?.user?.city, country: session?.user?.country, state: session?.user?.state, pincode: session?.user?.pincode, paymentMethod: 'Prepaid',
        },
    });

    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
    });

    const generateOTP = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendOTP/otp`);
            if (response.data.st) {
                setOTP(true);
                const id = setInterval(() => {

                    setTimeInSeconds(prevTime => {
                        if (prevTime - 1 <= 0) {
                            setVerifyOTP({ st: false, msg: "", })
                        }
                        return prevTime - 1
                    });

                }, 1000);
                setTimer(true)
                setIntervalId(Number(id));

                setVerifyOTP({ st: false, msg: response.data.msg, })
            } else {
                errorToast(response.data.msg);
            }

        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
        }
    }


    const destroyOtp = async () => {
        try {

            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/destroyOtp/otp`);

        } catch (error) {
            console.log('error::: ', error);
        }
    }

    useEffect(() => {
        if (timeInSeconds <= 0) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            destroyOtp()
            setOTP(false)

        } else if (!OTP) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            destroyOtp()
        }
    }, [timeInSeconds]);

    useEffect(() => {
        if (!timer) {
            setInputValues({
                input1: '',
                input2: '',
                input3: '',
                input4: '',
                input5: '',
                input6: '',
            });
        }
    }, [timer])

    useEffect(() => {
        window.addEventListener('beforeunload', destroyOtp);
        return () => {
            window.removeEventListener('beforeunload', destroyOtp);
        };
    }, []);

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


    const onSubmit = async (data: any) => {

        try {
            setLoader(true)

            const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty, checked: true, size: productSize }], data }

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

    useEffect(() => {

        if (isVerifyOTP?.st === true) {

            onSubmit(form.control?._formValues)
        }
    }, [isVerifyOTP, form])
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

                    {
                        OTP ?

                            <div className='grid grid-cols-1 items-center text-center justify-center gap-2'>

                                <OTPInputGroup timer={timer} setOTP={setOTP} setVerifyOTP={setVerifyOTP} isVerifyOTP={isVerifyOTP} setTimer={setTimer} setInputValues={setInputValues} inputValues={inputValues} intervalId={intervalId} setTimeInSeconds={setTimeInSeconds} />
                                <div className=' text-sm' >Time Left to Use OTP : {timerDisplay}</div>
                            </div>
                            :
                            <Button type='button' disabled={loader} className="w-full max-w-xs sm:ml-20 md:ml-20 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900" onClick={() => {

                                const orderMeta = { selectedItems: [{ productId: order_[0]?.id, qty: order_[0]?.qty, checked: true, size: productSize }] }
                                const isSizes: any = checkSizes(orderMeta?.selectedItems)

                                if (!isSizes.st) {
                                    errorToast(isSizes.msg);
                                    return
                                }
                                if (form.control?._formValues?.paymentMethod === "COD") {
                                    setTimeInSeconds(60);
                                    generateOTP();

                                } else {
                                    onSubmit(form.control?._formValues)
                                }

                            }} >
                                PROCEED
                            </Button>
                    }
                </form>
            </Form>
        </div >
    )
}

export default Payment