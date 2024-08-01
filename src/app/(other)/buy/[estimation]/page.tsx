"use client";

import { Fragment, useEffect, useState } from 'react'
import { RedirectType, useRouter, useSearchParams, } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import axios from 'axios';
import { Product } from '../../../../../types/global';
// import OTPInputGroup from '@/components/frontside/otp/page';
import Image from 'next/image';
import Script from 'next/script';
import ThankingMsg from "@/components/frontside/ThankingMsg/page"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Card as CardComponent,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardBody, Slider } from "@nextui-org/react";
import Link from 'next/link';
import { StarRating } from '@/components/frontside/TopselectionCard/page';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import Cart from "@/components/Cart";
import { checkSizes } from '@/app/utils';
import { size } from 'lodash';
import Payment from '@/components/frontside/Payment/pageForBuy';

export default function Checkout({ params }: { params: { estimation: string } }) {


    const { data: session, status }: any = useSession();
    let [subTotal, setSubTotal] = useState(0)
    const [taxableAmtTotal, setTaxableTotal] = useState(0)

    const [totalDiscount, setDiscountTotal] = useState(0)
    const [gstTotal, setGat] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [thankingMsg, setThankingMsg] = useState(false)
const [productSize, setProductSize] = useState("NONE")

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
                console.log('productData::: ', productData);
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
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-6xl px-4 mx-auto mt-8 mb-8 py-6">

            {thankingMsg ? <ThankingMsg /> :
                order_.length > 0 ?
                    <>
                        <CardComponent className="w-full">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[300px] w-auto mt-1 rounded-md border">
                                {session && order_?.length > 0 ? (
                                    order_?.map((item: any, i: number) => (
                                        <Card
                                            className="border-none m-2 bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                                            shadow="sm"
                                        >
                                            <CardBody>
                                                <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                                                    <div className="relative col-span-6 md:col-span-4">
                                                        <Image
                                                            height={100}
                                                            src={`/products/${item?.image[0]}`}
                                                            width={150}
                                                            alt={item?.name || "Product Image"}
                                                            className="rounded-xl w-[150px] h-[130px] object-cover object-center"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col col-span-6 md:col-span-8">
                                                        <div className="flex relative justify-between items-start">


                                                            <div className="flex flex-col gap-0">
                                                                <h3 className="font-semibold  text-sm text-foreground/90">
                                                                    {item?.name}
                                                                </h3>
                                                                <p className="text-tiny text-foreground/80">
                                                                    {item?.description.split(' ').slice(0, 10).join(' ')}...
                                                                    <Link href={`/preview/${item?.id}`} className="text-orange-500">
                                                                        Preview
                                                                    </Link>
                                                                </p>
                                                                <h1 className=" flex justify-between text-sm font-medium mt-2">
                                                                    <div>

                                                                        <StarRating rating={item?.avgRating || 5} />
                                                                    </div>
                                                                    <div className="flex justify-between  ">
                                                                        <p className="text-sm ">₹{
                                                                            item?.discountType === "PERCENTAGE" ?
                                                                                item?.price - ((item?.price) * item?.discount / 100) :
                                                                                item?.price - item?.discount
                                                                        }
                                                                        </p>
                                                                        <div className="text-sm text-muted-foreground ml-2 line-through">₹{item.price}</div>
                                                                        <p className="text-green-500 ml-2 text-sm font-semibold">
                                                                            {item?.discountType === "PERCENTAGE" ? (
                                                                                <span>{item?.discount}% off</span>
                                                                            ) : (
                                                                                <span>{item?.discount} ₹ off</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </h1>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between w-full mt-2 ">
                                                            <div className="flex items-center gap-2">
                                                                <p className='text-sm'> Select size</p>
                                                                <ToggleGroup value={productSize} type="single" variant="outline" onValueChange={(value: any) => {

                                                                    setProductSize(value)
                                                                }} >
                                                                    {
                                                                        item?.size?.map((item: any) => (
                                                                            <ToggleGroupItem
                                                                                key={item}
                                                                                value={item}
                                                                                className="w-3 h-6 bg-gray-400 text-black  border-black "
                                                                            >
                                                                                <p className="text-tiny">{item}</p>
                                                                            </ToggleGroupItem>
                                                                        ))
                                                                    }
                                                                </ToggleGroup>
                                                            </div>

                                                            <div className="flex items-center gap-2 ml-2">
                                                                <Button className=" bg-white border border-black text-black h-[30px] w-2 rounded-sm hover:bg-green-700"
                                                                    onClick={() => {
                                                                        const updatedItems: any = order_?.map((o: any) => {
                                                                            return { ...o, qty: o?.qty + 1 };
                                                                        });
                                                                        setOrder(updatedItems);
                                                                    }}>+</Button>
                                                                <p> {item.qty}</p>
                                                                <Button className="bg-white border border-black text-black  h-[30px] w-2 rounded-sm  hover:bg-red-700" onClick={() => {
                                                                    const updatedItems: any = order_.map((o: any) => {

                                                                        if (o.qty <= 1) {
                                                                            return { ...o, qty: 1 };
                                                                        }
                                                                        return { ...o, qty: o.qty - 1 };
                                                                    });
                                                                    setOrder(updatedItems);
                                                                }}>-</Button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-foreground/80">No Items</p>
                                )}
                            </ScrollArea>

                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg m-4 p-4">
                                <div className="flex items-center text-sm justify-between px-4">
                                    <div>Sub Total  </div>
                                    <div> ₹ {subTotal}.00</div>
                                </div>

                                <div className="flex items-center  text-sm  justify-between px-4">
                                    <div> Discount </div>
                                    <div> ₹ {totalDiscount}.00</div>
                                </div>
                                <div className="flex items-center text-sm justify-between px-4">
                                    <div>Taxable Amount </div>
                                    <div> ₹ {taxableAmtTotal}.00</div>
                                </div>

                                <div className="flex items-center  text-sm justify-between px-4">
                                    <div>Gst</div>
                                    <div> ₹ {Math.floor(gstTotal) || 0}.00 </div>
                                </div>
                            </div>

                            <Separator className="my-2" />
                            <div className="flex items-center  text-xl   justify-between px-4 py-4">
                                <div>Total Amount</div>
                                <div> ₹ {Math.floor(totalAmount) || 0}</div>
                            </div>

                        </CardComponent>

                        <div>
                            <CardComponent className="w-full">
                                <CardHeader>
                                    <CardTitle>Payment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid grid-cols-[1fr_100px] items-center gap-4">
                                            <div className="grid gap-1">
                                                <p className="text-sm text-muted-foreground">Payable Amount</p>
                                            </div>
                                            <p className="font-semibold text-right">₹ {Math.floor(totalAmount) || 0}</p>
                                        </div>
                                        <Separator />
                                        <Payment order_={order_} setThankingMsg={setThankingMsg} productSize={productSize} setProductSize={setProductSize} checkSizes={checkSizes} returnOrder={false} />
                                    </div>
                                </CardContent>
                            </CardComponent>
                        </div>
                    </> :
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="border-t border-gray-200 dark:border-gray-800">
                                Loading
                            </div>
                        </div>
                    </div>
            }
            <Cart />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
};

