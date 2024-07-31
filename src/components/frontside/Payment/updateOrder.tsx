"use client";
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema } from "../../../app/utils"
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button'
import { errorToast, successToast } from '@/components/toster'
import { useAppSelector, useAppDispatch } from "../../../app/redux/hooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import PaymentFields from './paymentFields'
import { updateOrdersFunc } from '../../../app/redux/slices/orderSlices';
import { useSearchParams, } from 'next/navigation'

const UpdateOrder = ({ order_ }: { order_: any; }) => {
    const { data: session, status }: any = useSession();

    const [loader, setLoader] = useState(false);
    const searchParams = useSearchParams()
    const orderID: string | null = searchParams.get('orderID')
    const orderData = orderID && useAppSelector((state) => state?.orderReducer?.orders?.find((order: any) => order.id === orderID))

    const dispatch = useAppDispatch();

    const onSubmit = async (data: any) => {

        try {
            setLoader(true)

            let orderMeta: any = {
                selectedItems: order_.map((item: any, index: number) => {
                    if (item.checked === true) {
                        return { productId: item.product.id, qty: item.qty, size: item.size };
                    }
                    return null;
                }).filter(Boolean)
            }

            if (orderMeta.selectedItems.length === 0) {
                errorToast("Please select atleast one item to proceed")
                return
            }

            orderMeta.data = data

            const res: any = await dispatch(updateOrdersFunc({ id: orderID, data: orderMeta, orderStatus: "UPDATE" }))

            res?.payload?.st ? successToast(res?.payload?.msg) : errorToast(res?.payload?.msg);
            setLoader(false)


        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
            setLoader(false)
        }
    };
    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            name: orderData?.name, mobile: orderData?.mobile, country_code: orderData?.country_code, address: orderData?.address, city: orderData?.city, country: orderData?.country, state: orderData?.state, pincode: orderData?.pincode, paymentMethod: 'COD',
        },
    });

    useEffect(() => {
        if (orderData) {
            form?.reset({
                name: orderData?.name,
                mobile: orderData?.mobile,
                country_code: orderData?.country_code,
                address: orderData?.address,
                city: orderData?.city,
                country: orderData?.country,
                state: orderData?.state,
                pincode: orderData?.pincode,
                paymentMethod: orderData?.paymentMethod,
            });
        }
    }, [orderData, form?.reset]);

    return (
        <div className="">
            <Form {...form}  >
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <PaymentFields form={form} returnOrder={false} />


                    {session && <Button type='submit' disabled={loader} className="w-full max-w-xs mt-6 sm:ml-20 md:ml-20 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900" >
                        Update Order
                    </Button>}
                </form>
            </Form>
        </div >
    )
}

export default UpdateOrder