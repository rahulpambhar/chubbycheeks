"use client";

import { Fragment, useEffect, useState } from "react";
import { RedirectType, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { getOrdersFunc, } from "../../../redux/slices/orderSlices";
import { useSession } from "next-auth/react";
import axios from "axios";
import { actionTocartFunction_ } from "@/components/Cart";
import { fetchCategories } from "../../../redux/slices/categorySlice";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { setHours, setMinutes, setSeconds, setMilliseconds, } from "date-fns";
import Script from "next/script";
import Cart from "@/components/Cart";
import { DateRange } from "react-day-picker";
import ThankingMsg from "@/components/frontside/ThankingMsg/page";
import { Card, CardBody, Slider } from "@nextui-org/react";
import { Card as CardComponent, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import moment from "moment"
import Link from "next/link";
import { StarRating } from "@/components/frontside/TopselectionCard/page";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { checkSizes } from "@/app/utils";
import Payment from "@/components/frontside/Payment/page";
import { getReturnOrdersFunc } from "@/app/redux/slices/returnOrderSlice";

export default function Checkout({ params, }: { params: { estimation: string }; }) {
    const { data: session, status }: any = useSession();
    const [subTotal, setSubTotal] = useState(0);
    const [taxableAmtTotal, setTaxableTotal] = useState(0);

    const [totalDiscount, setDiscountTotal] = useState(0);
    const [gstTotal, setGat] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [repeatOrder, setRepeatOrder] = useState(true);
    const [returnOrder, setReturnOrder] = useState(false);
    const [returnOrderDisabled, setReturnOrderDisabled] = useState(false);
    const [thankingMsg, setThankingMsg] = useState(false);

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const [date, setDate] = useState<DateRange | undefined>({
        from: oneMonthAgo,
        to: today,
    });

    const dispatch = useAppDispatch();
    const actionTocartFunction = (item: any, action: any) =>
        actionTocartFunction_(item, action, dispatch);

    const getOrders = async () =>
        await dispatch(
            getOrdersFunc({
                page: 1,
                limit: 1000,
                search: "",
                from: date?.from?.toString(),
                to: date?.to?.toString(),
                slug: "getAll",
            })
        );
    const searchParams = useSearchParams();

    const router = useRouter();
    const orderID: string | null = searchParams.get("orderID");
    const returnOrderID: string | null = searchParams.get("returnOrderID");

    const expectedDate = useAppSelector((state: any) =>
        state?.orderReducer?.orders?.find((order: any) => order.id === orderID)
    );
    const id = params?.estimation;
    let productForBuy: any = useAppSelector((state: any) =>
        state?.categories?.products?.find((item: any) => item.id === id)
    );

    productForBuy = [{ ...productForBuy, checked: true }];

    const [order_, setOrder]: any = useState([]);
    const order = orderID
        ? useAppSelector(
            (state: any) =>
                state?.orderReducer?.orders?.find(
                    (order: any) => order.id === orderID
                )?.OrderItem
        )
        : returnOrderID
            ? useAppSelector(
                (state: any) =>
                    state?.returnOrderReducer?.returnOrderId?.items)
            : useAppSelector((state: any) => state?.cartReducer?.cartItem) || [];

    const isLoading = useAppSelector((state: any) => state?.cartReducer?.loading);
    const orderDetail = orderID
        ? useAppSelector(
            (state: any) =>
                state?.orderReducer?.orders?.find(
                    (order: any) => order.id === orderID
                )
        )
        : returnOrderID ? useAppSelector(
            (state: any) =>
                state?.returnOrderReducer?.returnOrderId) : [];
    useEffect(() => {
        orderID
            ? setOrder(order?.map((item: any) => ({ ...item, checked: true })))
            : setOrder(order);
    }, [order]);

    useEffect(() => {
        setSubTotal(
            order_?.reduce((acc: any, item: any) => {
                let subTotalAmt = item?.product?.price * item?.qty;
                return item.checked ? acc + subTotalAmt : acc + 0;
            }, 0)
        );

        setTaxableTotal(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0;

                if (item?.product?.discountType === "PERCENTAGE") {
                    taxableAmount =
                        item?.product?.price * item?.qty -
                        (item?.product?.price * item?.qty * item?.product?.discount) / 100;
                } else {
                    taxableAmount =
                        (item?.product?.price - item?.product?.discount) * item?.qty;
                }
                return item.checked ? acc + taxableAmount : acc + 0;
            }, 0)
        );
        setDiscountTotal(
            order_?.reduce((acc: any, item: any) => {
                let discount = 0;

                if (item?.product?.discountType === "PERCENTAGE") {
                    discount =
                        (item?.product?.price * item?.qty * item?.product?.discount) / 100;
                } else {
                    discount = item?.product?.discount;
                }
                return item.checked ? acc + discount : acc + 0;
            }, 0)
        );
        setGat(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0;
                let gstTotal = 0;

                if (item?.product?.discountType === "PERCENTAGE") {
                    taxableAmount =
                        item?.product?.price * item?.qty -
                        (item?.product?.price * item?.qty * item?.product?.discount) / 100;
                    gstTotal = (taxableAmount * item?.product?.gst) / 100;
                } else {
                    taxableAmount =
                        (item?.product?.price - item?.product?.discount) * item?.qty;
                    gstTotal = (taxableAmount * item?.product?.gst) / 100;
                }
                return item.checked ? acc + gstTotal : acc + 0;
            }, 0)
        );

        setTotalAmount(
            order_?.reduce((acc: any, item: any) => {
                let taxableAmount = 0;
                let netAmount = 0;

                if (item?.product?.discountType === "PERCENTAGE") {
                    taxableAmount =
                        item?.product?.price * item?.qty -
                        (item?.product?.price * item?.qty * item?.product?.discount) / 100;
                    netAmount =
                        (taxableAmount * item?.product?.gst) / 100 + taxableAmount;
                } else {
                    taxableAmount =
                        (item?.product?.price - item?.product?.discount) * item?.qty;
                    netAmount =
                        (taxableAmount * item?.product?.gst) / 100 + taxableAmount;
                }
                return item.checked ? acc + netAmount : acc + 0;
            }, 0)
        );
    }, [order_]);

    useEffect(() => {
        !session && router.push('/')
        getOrders();
    }, []);

    const toggleSelect = (id: any, index: number) => {
        setOrder(
            order_.map((item: any) => {
                return item.id === id ? { ...item, checked: !item.checked } : item;
            })
        );
    };

    const toggleRepeatOrder = () => {
        setRepeatOrder(true);
        setReturnOrder(false);
        setOrder(
            order_?.map((item: any) => {
                return { ...item, checked: true };
            })
        );
    };

    const toggleReturnOrder = () => {
        setRepeatOrder(false);
        setReturnOrder(true);
        setOrder(
            order?.map((item: any) => {
                return { ...item, checked: false };
            })
        );
    };

    useEffect(() => {
        if (orderID) {
            const isReturnOrderFunc = async () => {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/return/returnOrder?slug=getById&orderID=${orderID}`
                );
                if (!response.data.st) {
                    setReturnOrderDisabled(true);
                }
            };
            isReturnOrderFunc();
        }
    }, [orderID]);

    const getReturnOrder = async () => await dispatch(getReturnOrdersFunc({ page: 1, limit: 10, search: returnOrderID, from: "", to: "", slug: "getById", }))

    useEffect(() => {
        !returnOrderID && !orderID && dispatch(fetchCategories());
        returnOrderID && !orderID && getReturnOrder();
    }, [dispatch, id, returnOrderID]);
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-6xl px-4 mx-auto mt-8 mb-8 py-6">

            {thankingMsg ? <ThankingMsg /> :
                <>
                    <CardComponent className="w-full">
                        <CardHeader>
                            {!returnOrderID ? <CardTitle>Order Summary</CardTitle> : <CardTitle>Return Order Summary</CardTitle>}

                            {orderDetail && orderID || returnOrderID ?
                                <div>
                                    <h6 className="text-tiny font-bold">ID: {orderDetail?.id}</h6>
                                    <h6 className="text-tiny font-bold">Date: {moment(orderDetail?.createdAt).format('DD-MM-YYYY')}</h6>
                                </div>
                                : null
                            }


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
                                                            if (orderID && repeatOrder || returnOrder || returnOrderID) {
                                                                toggleSelect(item.id, i)
                                                            } else {
                                                                actionTocartFunction(item, "checked ")
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
                                                                    <div className="text-sm text-muted-foreground ml-2 line-through">₹{item?.product?.price}</div>
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
                                                        {!returnOrder ?
                                                            <div className="flex items-center gap-2">
                                                                <p className='text-sm'> Select size</p>
                                                                <ToggleGroup value={item?.size} type="single" variant="outline" onValueChange={(value: any) => {
                                                                    const newArray = order_?.map((e: any) => {
                                                                        if (e.id === item.id && value !== "") {
                                                                            !orderID && !returnOrderID && actionTocartFunction({ ...e, size: value }, "size")
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
                                                                                className="w-auto h-6 bg-gray-400 text-black  border-black "
                                                                            >
                                                                                <p className="text-tiny">{item}</p>
                                                                            </ToggleGroupItem>
                                                                        ))
                                                                    }
                                                                </ToggleGroup>
                                                            </div>
                                                            :
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm">Ordered size</p>
                                                                <p className="text-tiny border border-black rounded-md w-8 h-full flex items-center justify-center">
                                                                    {item?.size}
                                                                </p>
                                                            </div>
                                                        }

                                                        <div className="flex items-center gap-2 ml-2">
                                                            <Button className=" bg-white border border-black text-black h-[30px] w-2 rounded-sm hover:bg-green-700" disabled={isLoading} onClick={() => {
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
                                                            }} >+</Button>
                                                            <h1 className="text-sm ml-2 ">{item.qty}</h1>
                                                            <Button className="bg-white border border-black text-black  h-[30px] w-2 rounded-sm  hover:bg-red-700" disabled={isLoading} onClick={() => {
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
                                                            }}
                                                            >-</Button>

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
                            <div> ₹ {Math.floor(totalAmount) || 0}</div>
                        </div>

                    </CardComponent>

                    <div>
                        <CardComponent className="w-full">
                            <CardHeader>
                                <CardTitle>{returnOrder ? "Return Value" : "Payment"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-[1fr_100px] items-center gap-4">
                                        <div className="grid gap-1">
                                            <p className="text-sm text-muted-foreground">Amount</p>
                                        </div>
                                        <p className="font-semibold text-right">₹ {Math.floor(totalAmount) || 0}</p>
                                    </div>
                                    <Separator />
                                    <>
                                        <Payment toggleRepeatOrder={toggleRepeatOrder} repeatOrder={repeatOrder} setThankingMsg={setThankingMsg} returnOrderDisabled={returnOrderDisabled}
                                            expectedDate={expectedDate} order_={order_} checkSizes={checkSizes} returnOrder={returnOrder} toggleReturnOrder={toggleReturnOrder} />
                                    </>
                                </div>
                            </CardContent>
                        </CardComponent>
                    </div></>}
            <Cart />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
}

// export function Checkout_({ params }: { params: { estimation: string } }) {

//     return (
//         <>
//             <div className="flex flex-col min-h-screen py-12 md:py-24 items-center justify-start space-y-4">
//                 <div className="w-full max-w-2xl px-4">
//                     {thankingMsg ? <ThankingMsg /> :
//                         <div className="grid gap-4 md:grid-cols-2">
//                             <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-semibold">Order Summary</h3>
//                                 </div>
//                                 <div className="border-t border-gray-200 dark:border-gray-800">
//                                     <ScrollArea className="h-[350px] w-auto mt-1 rounded-md border">

//                                         {session && order_?.length > 0 ? order_?.map((item: any, i: number) => (
//                                             <>

//                                                 <div key={item.id} className="flex items-center justify-between text-sm ">
//                                                     <div className="relative flex items-center border border-black   ">
//                                                         {<input
//                                                             type="checkbox"
//                                                             checked={item?.checked}
//                                                             className='absolute top-0 '
//                                                             onChange={() => {
//                                                                 if (orderID && repeatOrder || returnOrder) {
//                                                                     toggleSelect(item.id, i)
//                                                                 } else {
//                                                                     actionTocartFunction(item, "checked")
//                                                                 }
//                                                             }}
//                                                         />}
//                                                         <div className="w-16 h-16 border border-black  rounded-md overflow-hidden">
//                                                             <Image height={100} width={100} alt="Product image" className="object-cover   w-full h-full" src={`/products/${item?.product?.image[0]}`} />
//                                                         </div>
//                                                         <div className="text-sm border border-black  ">
//                                                             <h6 className="font-medium text-sm">{item?.product?.name}</h6>
//                                                             <p className="text-gray-500 text-sm dark:text-gray-400">₹{orderID ? item?.product?.price : item?.product?.price} x {item?.qty}</p>
//                                                             <p className="text-gray-500 text-sm dark:text-gray-400">Size : M</p>
//                                                         </div>

//                                                         {item.checked &&
//                                                             <div className=" justify-center items-center ">

//                                                                 <Button className='bg-green-200  h-[5px] w-[5px] rounded-sm' disabled={isLoading} onClick={() => {
//                                                                     const updatedItems: any = order_.map((o: any) => {
//                                                                         const orderQty = order?.find((val: any) => val.id === item.id)?.qty || 0;
//                                                                         if (o.id === item.id) {
//                                                                             if (orderID && returnOrder && orderQty > item.qty) {
//                                                                                 return { ...o, qty: o.qty + 1 };
//                                                                             } else if (orderID && repeatOrder) {
//                                                                                 return { ...o, qty: o.qty + 1 };
//                                                                             } else if (!orderID) {
//                                                                                 actionTocartFunction(item, "add")
//                                                                             }
//                                                                         }
//                                                                         return o;
//                                                                     });
//                                                                     setOrder(updatedItems);
//                                                                 }}>+</Button>
//                                                                 <h1 className="text-sm ml-2 ">{item.qty}</h1>
//                                                                 <Button className=' bg-red-200  h-[5px] w-[5px] rounded-sm' disabled={isLoading} onClick={() => {
//                                                                     const updatedItems: any = order_.map((o: any) => {
//                                                                         if (o.id === item.id && o.qty > 1) {
//                                                                             if (!orderID) {
//                                                                                 actionTocartFunction(order[i], "remove")
//                                                                             } else {
//                                                                                 return { ...o, qty: o.qty - 1 };
//                                                                             }
//                                                                         }
//                                                                         return o;
//                                                                     });
//                                                                     setOrder(updatedItems);
//                                                                 }}>-</Button>
//                                                             </div>
//                                                         }
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <div className="font-medium"> ₹ {item?.product?.price * item.qty}</div>
//                                                     </div>
//                                                 </div>

//                                                 <Separator className="my-2" />
//                                             </>
//                                         )) : "NO ITEMS FOUND"}
//                                     </ScrollArea>

//                                 </div>
//                             </div>
//                             <div className="flex flex-col gap-4">
//                                 <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
//                                     <div className="p-4">
//                                         <h3 className="text-lg font-semibold">Shipping information</h3>
//                                     </div>
//                                     <div className="p-4">
//                                         <div className="text-sm">
//                                             <div className="font-medium">{session?.user?.name}</div>
//                                             <div>{session?.user?.address}</div>
//                                             <div>{session?.user?.city}</div>
//                                             <div>{session?.user?.country}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {returnOrder === false ? <div className="border hi border-gray-200 dark:border-gray-800 rounded-lg">
//                                     <div className="p-4">
//                                         <h3 className="text-lg font-semibold">Payment information</h3>
//                                     </div>
//                                     <div className="p-4">
//                                         <div className="text-sm">
//                                             <div className="grid gap-2">
//                                                 <label className="font-medium" htmlFor="name">
//                                                     Name
//                                                 </label>
//                                                 <input className="input" id="name" placeholder="Enter your name" type="text" />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <label className="font-medium" htmlFor="card">
//                                                     Card number
//                                                 </label>
//                                                 <input className="input" id="card" placeholder="Enter your card number" type="password" />
//                                             </div>

//                                             <div className="flex gap-4">
//                                                 <div className="grid gap-2">
//                                                     <label className="font-medium" htmlFor="expiry">
//                                                         Expiry date
//                                                     </label>
//                                                     <input className="input" id="expiry" placeholder="MM/YY" type="text" />
//                                                 </div>
//                                                 <div className="grid gap-2">
//                                                     <label className="font-medium" htmlFor="cvv">
//                                                         CVV
//                                                     </label>
//                                                     <input className="input" id="cvv" placeholder="Enter your CVV" type="password" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div> :
//                                     <>

//                                         <h6 className='text uppercase font-bold'>Return Note</h6>
//                                         <textarea
//                                             className="w-full border border-blue-700"
//                                             placeholder="Type your message here."
//                                             value={returnNote}
//                                             onChange={handleChange}
//                                         />
//                                         <div>{maxChars - returnNote.length} characters remaining</div>
//                                         <h6 className=' uppercase font-bold'>Attachment</h6>

//                                         <Input type="file" onChange={handleFileChange} />
//                                         {error && <div style={{ color: 'red' }}>{error}</div>}
//                                     </>
//                                 }
//                                 {
//                                     session &&
//                                     <div>
//                                         {
//                                             orderID && <div>
//                                                 <button onClick={toggleRepeatOrder} style={{ color: repeatOrder ? 'green' : 'black' }}>
//                                                     Repeat Order
//                                                 </button>
//                                                 {!returnOrderDisabled && expectedDate?.orderStatus === "COMPLETE" &&
//                                                     new Date() <= new Date(expectedDate?.expectedDate) && (

//                                                         <button onClick={toggleReturnOrder} style={{ color: returnOrder ? 'red' : 'black' }}>
//                                                             Return Order
//                                                         </button>
//                                                     )
//                                                 }
//                                             </div>
//                                         }
//                                         <button
//                                             onClick={async () => {
//                                                 try {
//                                                     let orderMeta: any = {
//                                                         selectedItems: order_.map((item: any, index: number) => {
//                                                             if (item.checked === true) {
//                                                                 return { productId: item.product.id, qty: item.qty, };
//                                                             }
//                                                             return null;
//                                                         }).filter(Boolean)
//                                                     }
//                                                     orderMeta.paymentMethod = "Prepaid"

//                                                     if (orderMeta.selectedItems.length === 0) {
//                                                         errorToast("Please select atleast one item to proceed")
//                                                         return
//                                                     }

//                                                     if (!returnOrder) {
//                                                         const tempData = await dispatch(createTempOrderFunc(orderMeta))

//                                                         if (tempData?.payload.st) {
//                                                             // successToast("Temp order done!")
//                                                             const options = {
//                                                                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                                                                 key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
//                                                                 amount: tempData?.payload?.data?.amount,
//                                                                 currency: tempData?.payload?.data?.currency,
//                                                                 order_receipt: tempData?.payload?.data?.id,
//                                                                 name: process.env.NEXT_PUBLIC_APP_NAME,
//                                                                 description: "test",
//                                                                 image: "/image/chubbyCheeks/logo.png",
//                                                                 handler: async function (response: any) {
//                                                                     const paymentId = response.razorpay_payment_id;

//                                                                     const orderInfo = {
//                                                                         temOrdrId: tempData?.payload?.temOrdrId,
//                                                                         paymentId,
//                                                                         repeatOrder: orderID ? true : false
//                                                                     }
//                                                                     try {
//                                                                         const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
//                                                                         data.st ? successToast(data.msg) : errorToast(data.msg);
//                                                                         await dispatch(fetchCart())
//                                                                         setThankingMsg(true)

//                                                                     } catch (error: any) {
//                                                                         console.log('error::: ', error);
//                                                                         errorToast("Something went wrong!!!");
//                                                                     }
//                                                                 },
//                                                                 theme: {
//                                                                     color: "#000000"
//                                                                 }
//                                                             }

//                                                             if (typeof window !== "undefined" && (window as any).Razorpay) {
//                                                                 const rzp1 = new (window as any).Razorpay(options);
//                                                                 rzp1.open();
//                                                             } else {
//                                                                 errorToast("Razorpay SDK not loaded");
//                                                             }
//                                                         } else {
//                                                             errorToast(tempData.payload.msg)
//                                                         }
//                                                     } else {

//                                                         const data = {
//                                                             orderID: orderID,
//                                                             returnNote: returnNote,
//                                                             selectedItems: orderMeta?.selectedItems
//                                                         }

//                                                         const formData = new FormData();

//                                                         orderID && formData.append('orderID', orderID)
//                                                         formData.append('returnNote', returnNote)
//                                                         formData.append('selectedItems', JSON.stringify(orderMeta?.selectedItems))
//                                                         file && formData.append("attachment", file);

//                                                         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/return/returnOrder`, formData);
//                                                         if (response.data.st) {
//                                                             successToast(response.data.msg)
//                                                             setReturnNote("")
//                                                         } else {
//                                                             errorToast(response.data.msg)
//                                                         }
//                                                     }

//                                                 } catch (error) {
//                                                     console.log('error--> ', error);
//                                                     errorToast("Something went wrong!!!")
//                                                 }
//                                             }}
//                                             className="w-full max-w-xs ml-auto bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
//                                         >
//                                             {orderID ? "PROCEED" : " ONLINE PAY"}
//                                         </button>
//                                         {!returnOrder && <button
//                                             onClick={async () => {
//                                                 try {
//                                                     setLoader(true)

//                                                     let orderMeta: any = {
//                                                         selectedItems: order_.map((item: any, index: number) => {
//                                                             if (item.checked === true) {
//                                                                 return { productId: item.product.id, qty: item.qty, };
//                                                             }
//                                                             return null;
//                                                         }).filter(Boolean)
//                                                     }
//                                                     orderMeta.paymentMethod = "COD"
//                                                     const tempData = await dispatch(createTempOrderFunc(orderMeta))

//                                                     if (tempData?.payload.st) {
//                                                         const orderInfo = {
//                                                             temOrdrId: tempData?.payload?.temOrdrId,
//                                                             paymentId: "",
//                                                             repeatOrder: orderID ? true : false
//                                                         }
//                                                         try {
//                                                             const data = await dispatch(createOrderFunc(orderInfo)).unwrap();
//                                                             data.st ? successToast(data.msg) : errorToast(data.msg);
//                                                             setLoader(false)
//                                                             setThankingMsg(true)

//                                                         } catch (error: any) {
//                                                             console.log('error::: ', error);
//                                                             errorToast("Something went wrong!!!");
//                                                             setLoader(false)
//                                                         }

//                                                     } else {
//                                                         errorToast(tempData.payload.msg)
//                                                         setLoader(false)
//                                                     }
//                                                 } catch (error) {
//                                                     console.log('error::: ', error);
//                                                     errorToast("Something went wrong!!")
//                                                 }
//                                             }}
//                                             className="w-full max-w-xs ml-auto mt-2 bg-gray-900 text-white py-2 rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-900"
//                                         >
//                                             CASH ON DELIVERY
//                                         </button>}
//                                     </div>
//                                 }
//                             </div>
//                         </div>}
//                 </div>
//                 <Cart />
//             </div >
//             <Script src="https://checkout.razorpay.com/v1/checkout.js" />
//         </>
//     );
// };
