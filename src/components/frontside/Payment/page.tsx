import React, { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema } from "../../../app/utils"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button'
import { useSearchParams } from "next/navigation";
import { errorToast, successToast } from '@/components/toster'
import { useAppSelector, useAppDispatch } from "../../../app/redux/hooks";
import { createTempOrderFunc, createOrderFunc, getOrdersFunc, } from "../../../app/redux/slices/orderSlices";
import { fetchCart } from '@/app/redux/slices/cartSclice'
import axios from 'axios'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea'
import PaymentFields from './paymentFields'
const Payment = ({ toggleRepeatOrder, repeatOrder, setThankingMsg, returnOrderDisabled,
    expectedDate, order_, checkSizes, returnOrder, toggleReturnOrder,

}: {
    toggleRepeatOrder: any, repeatOrder: boolean, setThankingMsg: any, returnOrderDisabled: boolean;
    expectedDate: any; order_: any; checkSizes: any; returnOrder: any; toggleReturnOrder: any;
}) => {
    const { data: session, status }: any = useSession();
    const searchParams = useSearchParams();
    const [file, setFile] = useState<File | null>(null);
    const [returnNote, setReturnNote] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);

    let [OTP, setOTP] = useState(false)
    let [timer, setTimer] = useState(false)
    const [timeInSeconds, setTimeInSeconds] = useState(60);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isVerifyOTP, setVerifyOTP] = useState({ st: false, msg: "" });
    const maxChars = 500;

    const orderID: string | null = searchParams.get("orderID");
    const dispatch = useAppDispatch();

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            name: session?.user?.name, mobile: session?.user?.mobile, country_code: session?.user?.country_code, address: session?.user?.address, city: session?.user?.city, country: session?.user?.country, state: session?.user?.state, pincode: session?.user?.pincode, paymentMethod: 'Prepaid',
        },
    });
    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        const fileTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "video/avi",
            "video/mov",
            "video/mpeg",
        ];
        const maxsize = 25 * 1024 * 1024; // 25 MB

        if (selectedFile) {
            if (!fileTypes.includes(selectedFile.type)) {
                setError("File type must be an image or video.");
                setFile(null);
            } else if (selectedFile.size > maxsize) {
                setError("File size must be less than 25 MB.");
                setFile(null);
            } else {
                setError("");
                setFile(selectedFile);
            }
        }
    };

    const handleChange = (e: any) => {
        const { value } = e.target;
        if (value.length <= maxChars) {
            setReturnNote(value);
        }
    };
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

    const onSubmit = async (data: any) => {

        try {
            setLoader(true)

            let orderMeta: any = {
                selectedItems: order_.map((item: any, index: number) => {
                    if (item.checked === true) {

                        return { productId: item.product.id, qty: item.qty, size: item?.size, };
                    }
                    return null;
                }).filter(Boolean)
            }

            const isSizes: any = checkSizes(order_)

            if (!isSizes.st) {
                errorToast(isSizes.msg);
                setLoader(false)
                return
            }

            if (orderMeta.selectedItems.length === 0) {
                errorToast("Please select atleast one item to proceed")
                setLoader(false)
                return
            }


            if (data?.paymentMethod === "Prepaid") {
                orderMeta.data = data

                if (!returnOrder) {
                    const tempData = await dispatch(createTempOrderFunc(orderMeta))

                    if (tempData?.payload.st) {
                        // successToast("Temp order done!")
                        const options = {
                            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                            key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
                            amount: Math.floor(tempData?.payload?.data?.amount),
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
                                    repeatOrder: orderID ? true : false
                                }
                                try {
                                    const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
                                    data.st ? successToast(data.msg) : errorToast(data.msg);
                                    await dispatch(fetchCart())
                                    setThankingMsg(true)
                                    setLoader(false)

                                } catch (error: any) {
                                    console.log('error::: ', error);
                                    errorToast("Something went wrong!!!");
                                    setLoader(false)
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

                    const formData = new FormData();

                    orderID && formData.append('orderID', orderID)
                    formData.append('returnNote', returnNote)
                    formData.append('selectedItems', JSON.stringify(orderMeta?.selectedItems))
                    file && formData.append("attachment", file);

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/return/returnOrder`, formData);
                    if (response.data.st) {
                        successToast(response.data.msg)
                        setReturnNote("")
                        setLoader(false)

                    } else {
                        errorToast(response.data.msg)
                        setLoader(false)

                    }
                }

            } else {
                orderMeta.data = data
                const tempData = await dispatch(createTempOrderFunc(orderMeta))

                if (tempData?.payload.st) {
                    const orderInfo = {
                        temOrdrId: tempData?.payload?.temOrdrId,
                        paymentId: "",
                        repeatOrder: orderID ? true : false
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
                        returnOrder === true ?
                            <div className="grid grid-cols-2 gap-2">
                                <div className='grid gap-2' >
                                    <h6 className='text  font-bold'>Return Note</h6>
                                    <Textarea value={returnNote} onChange={handleChange} placeholder="Type your message here." />

                                    <div>{maxChars - returnNote.length} characters remaining</div>
                                </div>

                                <div className='grid gap-2'>

                                    <h6 className='font-bold'>Attachment</h6>

                                    <Input type="file" onChange={handleFileChange} />
                                    {error && <div style={{ color: 'red' }}>{error}</div>}
                                </div>
                            </div> :
                            <p className='h-[144px]'></p>
                    }


                    {
                        orderID && <div className=" flex gap-4 m-4 justify-center">
                            <Button type='button' onClick={toggleRepeatOrder} style={{ color: repeatOrder ? 'green' : 'black' }} className='bg-white border border-black' >
                                Repeat Order
                            </Button>
                            {!returnOrderDisabled && expectedDate?.orderStatus === "COMPLETE" &&
                                new Date() <= new Date(expectedDate?.expectedDate) && (

                                    <Button type='button' onClick={() => { toggleReturnOrder(); form.setValue('paymentMethod', 'Prepaid') }} style={{ color: returnOrder ? 'red' : 'black', }} className='bg-white border border-black' >
                                        Return Order
                                    </Button>
                                )
                            }
                        </div>
                    }

                    {
                        session && !returnOrder ?
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
                            </div> : <p className='h-[68px]'></p>
                    }
                    {
                        isVerifyOTP?.st 
                    }
                    <Button type='button' onClick={() => {
                        console.log('form', form.control?._formValues?.paymentMethod);
                        if (form.control?._formValues?.paymentMethod === "COD") {
                            setTimeInSeconds(60);
                            generateOTP();
                        }
                    }} disabled={loader} className="w-full max-w-xs sm:ml-20 md:ml-20 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900" >
                        PROCEED
                    </Button>
                </form>
            </Form>
        </div >
    )
}

export default Payment