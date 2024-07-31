"use client";

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { getOrdersFunc, } from '../../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";

import { fetchCategories } from "../../../../redux/slices/categorySlice";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';
import { addYears, setHours, setMinutes, setSeconds, setMilliseconds, } from "date-fns";

import Cart from '@/components/Cart';
import { DateRange } from "react-day-picker"
import {
    Card as CardComponent,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { StarRating } from "@/components/frontside/TopselectionCard/page";
import { Card, CardBody, Slider } from "@nextui-org/react";
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import UpdateOrder from '@/components/frontside/Payment/updateOrder';


export default function Checkout({ params }: { params: { estimation: string } }) {
    const { data: session, status }: any = useSession();
    const [subTotal, setSubTotal] = useState(0)
    const [taxableAmtTotal, setTaxableTotal] = useState(0)

    const [totalDiscount, setDiscountTotal] = useState(0)
    const [gstTotal, setGat] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [loader, setLoad] = useState(false)
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
                let discount = 0.00


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
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-6xl px-4 mx-auto mt-8 mb-8 py-6">

            <CardComponent className="w-full">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[500px] w-auto mt-1 rounded-md border">
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
                                                src={`/products/${item?.product?.image[0]}`}
                                                width={150}
                                                alt={item?.product?.name || "Product Image"}
                                                className="rounded-xl w-[150px] h-[130px] object-cover object-center"
                                            />
                                        </div>

                                        <div className="flex flex-col col-span-6 md:col-span-8">
                                            <div className="flex relative justify-between items-start">
                                                <Checkbox checked={item?.checked} onCheckedChange={(e) => {

                                                    orderID && toggleSelect(item.id, i)
                                                }} id="terms" className='absolute right-0 top-0 '
                                                />

                                                <div className="flex flex-col gap-0">
                                                    <h3 className="font-semibold  text-sm text-foreground/90">
                                                        {item?.product?.name}
                                                    </h3>
                                                    <p className="text-tiny text-foreground/80">
                                                        {item?.product?.description.split(' ').slice(0, 10).join(' ')}...
                                                        <Link href={`/preview/${item?.product?.id}`} className="text-orange-500">
                                                            Preview
                                                        </Link>
                                                    </p>
                                                    <h1 className=" flex justify-between text-sm font-medium mt-2">
                                                        <div>

                                                            <StarRating rating={item?.product?.avgRating || 5} />
                                                        </div>
                                                        <div className="flex justify-between  ">
                                                            <p className="text-sm ">₹{
                                                                item?.product?.discountType === "PERCENTAGE" ?
                                                                    item?.product?.price - ((item?.product?.price) * item?.product?.discount / 100) :
                                                                    item?.product?.price - item?.product?.discount
                                                            }
                                                            </p>
                                                            <div className="text-sm text-muted-foreground ml-2 line-through">₹{item?.product.price}</div>
                                                            <p className="text-green-500 ml-2 text-sm font-semibold">
                                                                {item?.product?.discountType === "PERCENTAGE" ? (
                                                                    <span>{item?.product?.discount}% off</span>
                                                                ) : (
                                                                    <span>{item?.product?.discount} ₹ off</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </h1>
                                                </div>
                                            </div>

                                            <div className="flex justify-between w-full mt-2 ">
                                                <div className="flex items-center gap-2">
                                                    <p className='text-sm'> Select size</p>
                                                    <ToggleGroup value={item?.size} type="single" variant="outline" onValueChange={(value: any) => {
                                                        const newArray = order_?.map((e: any) => {
                                                            if (e.id === item.id) {
                                                                return { ...e, size: value };
                                                            }
                                                            return e;

                                                        })
                                                        setOrder(newArray)
                                                    }} >
                                                        {
                                                            item?.product?.size?.map((item: any) => (
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

                                                {item.checked && <div className="flex items-center gap-2 ml-2">
                                                    <Button className=" bg-white border border-black text-black h-[30px] w-2 rounded-sm hover:bg-green-700" disabled={isLoading} onClick={() => {
                                                        const updatedItems: any = order_.map((o: any) => {
                                                            const orderQty = order?.find((val: any) => val.id === item.id)?.qty || 0;
                                                            if (o.id === item.id) {
                                                                return { ...o, qty: o.qty + 1 };
                                                            }
                                                            return o;
                                                        });
                                                        setOrder(updatedItems);
                                                    }}>+</Button>
                                                    <h1 className="text-sm">{item.qty}</h1>
                                                    <Button className="bg-white border border-black text-black  h-[30px] w-2 rounded-sm  hover:bg-red-700" disabled={isLoading} onClick={() => {
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
                        <div> ₹ {gstTotal}.00</div>
                    </div>
                </div>

                <Separator className="my-2" />
                <div className="flex items-center  text-xl   justify-between px-4 py-4">
                    <div>{orderID ? "Checked Total" : "Total Amount"}</div>
                    <div> ₹ {totalAmount}.00</div>
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

                            <UpdateOrder order_={order_} />
                        </div>
                    </CardContent>
                </CardComponent>
            </div>
            <Cart />
        </div>
    );
};

