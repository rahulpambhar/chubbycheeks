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
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-6xl px-4 mx-auto mt-8 mb-8 py-6">

            {thankingMsg ? <ThankingMsg /> : <>
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
                                                        if (orderID && repeatOrder || returnOrder) {
                                                            toggleSelect(item.id, i)
                                                        } else {
                                                            actionTocartFunction(item, "checked")
                                                        }

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

                                                    <div className="flex items-center gap-2 ml-2">
                                                        <Button className=" bg-white border border-black text-black h-[30px] w-2 rounded-sm hover:bg-green-700">+</Button>
                                                        <p>10</p>
                                                        <Button className="bg-white border border-black text-black  h-[30px] w-2 rounded-sm  hover:bg-red-700">-</Button>

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
                            <div> ₹ {gstTotal}</div>
                        </div>
                    </div>

                    <Separator className="my-2" />
                    <div className="flex items-center  text-xl   justify-between px-4 py-4">
                        <div>{orderID ? "Checked Total" : "Total Amount"}</div>
                        <div> ₹ {totalAmount}</div>
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
                                        <p className="text-sm text-muted-foreground">Subtotal</p>
                                    </div>
                                    <p className="font-semibold text-right">$179.96</p>
                                </div>
                                <div className="grid grid-cols-[1fr_100px] items-center gap-4">
                                    <div className="grid gap-1">
                                        <p className="text-sm text-muted-foreground">Discount</p>
                                    </div>
                                    <p className="font-semibold text-right text-green-500">
                                        -$15.00
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-[1fr_100px] items-center gap-4">
                                    <div className="grid gap-1">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                    </div>
                                    <p className="font-semibold text-right">$164.96</p>
                                </div>


                                {returnOrder === false ?
                                    <div className="">

                                        <div className="grid gap-2 m-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="First Last" />
                                        </div>
                                        {/* <div className="grid gap-2 m-2">
                                        <Label htmlFor="number">Card number</Label>
                                        <Input id="number" placeholder="Card number" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="month">Expires</Label>
                                            <Select>
                                                <SelectTrigger id="month">
                                                    <SelectValue placeholder="Month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[
                                                        "January",
                                                        "February",
                                                        "March",
                                                        "April",
                                                        "May",
                                                        "June",
                                                        "July",
                                                        "August",
                                                        "September",
                                                        "October",
                                                        "November",
                                                        "December",
                                                    ].map((month, index) => (
                                                        <SelectItem key={index} value="y">
                                                            {month}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="year">Year</Label>
                                            <Select>
                                                <SelectTrigger id="year">
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[2024, 2025, 2026, 2027, 2028, 2029].map((year) => (
                                                        <SelectItem key={year} value="8">
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="CVC" />
                                        </div>
                                    </div> */}


                                    </div>
                                    :
                                    <>

                                        <h6 className='text  font-bold'>Return Note</h6>
                                        <textarea
                                            className="w-full border border-blue-700"
                                            placeholder="Type your message here."
                                            value={returnNote}
                                            onChange={handleChange}
                                        />
                                        <div>{maxChars - returnNote.length} characters remaining</div>
                                        <h6 className='  font-bold'>Attachment</h6>

                                        <Input type="file" onChange={handleFileChange} />
                                        {error && <div style={{ color: 'red' }}>{error}</div>}
                                    </>
                                }
                                {
                                    session &&
                                    <div>
                                        {
                                            orderID && <div>
                                                <Button onClick={toggleRepeatOrder} style={{ color: repeatOrder ? 'green' : 'black' }}>
                                                    Repeat Order
                                                </Button>
                                                {!returnOrderDisabled && expectedDate?.orderStatus === "COMPLETE" &&
                                                    new Date() <= new Date(expectedDate?.expectedDate) && (

                                                        <Button onClick={toggleReturnOrder} style={{ color: returnOrder ? 'red' : 'black' }}>
                                                            Return Order
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        }
                                        <Button
                                            onClick={async () => {
                                                try {
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
                                                        return
                                                    }

                                                    orderMeta.paymentMethod = "Prepaid"

                                                    if (orderMeta.selectedItems.length === 0) {
                                                        errorToast("Please select atleast one item to proceed")
                                                        return
                                                    }

                                                    if (!returnOrder) {
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
                                                                        repeatOrder: orderID ? true : false
                                                                    }
                                                                    try {
                                                                        const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
                                                                        data.st ? successToast(data.msg) : errorToast(data.msg);
                                                                        await dispatch(fetchCart())
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
                                                            } else {
                                                                errorToast("Razorpay SDK not loaded");
                                                            }
                                                        } else {
                                                            errorToast(tempData.payload.msg)
                                                        }
                                                    } else {

                                                        const data = {
                                                            orderID: orderID,
                                                            returnNote: returnNote,
                                                            selectedItems: orderMeta?.selectedItems
                                                        }

                                                        const formData = new FormData();

                                                        orderID && formData.append('orderID', orderID)
                                                        formData.append('returnNote', returnNote)
                                                        formData.append('selectedItems', JSON.stringify(orderMeta?.selectedItems))
                                                        file && formData.append("attachment", file);

                                                        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/return/returnOrder`, formData);
                                                        if (response.data.st) {
                                                            successToast(response.data.msg)
                                                            setReturnNote("")
                                                        } else {
                                                            errorToast(response.data.msg)
                                                        }
                                                    }

                                                } catch (error) {
                                                    console.log('error--> ', error);
                                                    errorToast("Something went wrong!!!")
                                                }
                                            }}
                                            className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                        >
                                            {orderID ? "PROCEED" : " ONLINE PAY"}
                                        </Button>
                                        {!returnOrder &&
                                            <Button
                                                onClick={async () => {
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
                                                            return
                                                        }

                                                        if (orderMeta.selectedItems.length === 0) {
                                                            errorToast("Please select atleast one item to proceed")
                                                            return
                                                        }
                                                        orderMeta.paymentMethod = "COD"
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
                                                    } catch (error) {
                                                        console.log('error::: ', error);
                                                        errorToast("Something went wrong!!")
                                                    }
                                                }}
                                                className="w-full max-w-xs ml-auto mt-2 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
                                            >
                                                CASH ON DELIVERY
                                            </Button>}
                                    </div>
                                }
                            </div>
                        </CardContent>
                    </CardComponent>
                </div></>}

            <Cart />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        </div>


    );
};

{/* <div className="flex flex-col min-h-screen py-12 md:py-24 items-center justify-start space-y-4">
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

        </div > */}