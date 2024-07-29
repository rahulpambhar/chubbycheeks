"use client";
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline';
// import { XMarkIcon } from '@heroicons/react/outline'
import { useAppSelector, useAppDispatch } from '../app/redux/hooks';
import { isLoginModel, setOpenCart } from '../app/redux/slices/utilSlice'
import { createOrderFunc } from '../app/redux/slices/orderSlices'
import { actionTocartFunc } from '../app/redux/slices/cartSclice';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast"
import { successToast, errorToast } from './toster';
import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from './frontside/TopselectionCard/page';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardBody, Slider } from "@nextui-org/react";
import { Button } from '@/components/ui/button';


export const actionTocartFunction_ = async (item: any, action: any, dispatch: any) => {

    try {
        const payload = { productId: item?.productId, action, productSize: item?.size };
        if (action === "remove" && item.qty <= 1) {
            errorToast("Minimum 1 quantity required")
            return;
        }

        const data = await dispatch(actionTocartFunc(payload))

        if (data?.payload.st) {
            successToast(data?.payload.msg)
        } else {
            errorToast(data.payload.msg)
        }
    } catch (err) {
        errorToast(err);
    }
}

export default function Example() {
    const { data: session, status } = useSession();
    let [taxableAmount, setTaxable] = useState(0)
    const router = useRouter()

    const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
    const cartItem = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
    const isLoading = useAppSelector((state) => state?.cartReducer?.loading);

    const dispatch = useAppDispatch();

    const actionTocartFunction = (item: any, action: any) => actionTocartFunction_(item, action, dispatch)

    useEffect(() => {
        setTaxable(
            cartItem?.reduce((acc: any, item: any) => {
                if (item?.product?.discountType === "PERCENTAGE") {
                    return acc + (item?.product?.price * item?.qty - ((item?.product?.price * item?.qty) * item?.product?.discount / 100))
                } else {
                    return acc + ((item?.product?.price - item?.product?.discount) * item?.qty)
                }
            }, 0)
        );
    }, [cartItem])

    return (
        <div>
            <Transition.Root show={openCart} as={Fragment} >
                <Dialog as="div" className="relative z-10 mt-[70px]" onClose={setOpenCart}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                            onClick={() => dispatch(setOpenCart(!openCart))}
                                                        >
                                                            <span className="absolute -inset-0.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <span className="text-lg font-medium text-gray-900">Close </span>

                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {cartItem.map((item: any) => (
                                                                <Card
                                                                    className="border-none mt-2 bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                                                                    shadow="sm" key={item?.id}
                                                                >
                                                                    <CardBody>
                                                                        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                                                                            <div className="relative col-span-6 md:col-span-4">
                                                                                <Link href={`/preview/${item?.product?.id}`} className="">
                                                                                    <Image
                                                                                        height={100}
                                                                                        src={`/products/${item?.product?.image[0]}`}
                                                                                        width={150}
                                                                                        alt={item?.product?.name || "Product Image"}
                                                                                        className="rounded-xl w-[150px] h-[140px] object-cover object-center"
                                                                                    />
                                                                                </Link>
                                                                            </div>



                                                                            <div className="flex flex-col col-span-6 md:col-span-8">
                                                                                <div className="flex relative justify-between  items-start">
                                                                                    <button disabled={isLoading}
                                                                                        onClick={() => {
                                                                                            session ? actionTocartFunction(item, "delete") : dispatch(isLoginModel(false));
                                                                                        }}
                                                                                        type="button"
                                                                                        className="font-medium absolute top-0 right-0 text-gray-400 hover:text-red-500"
                                                                                    >
                                                                                        x
                                                                                    </button>

                                                                                    <div className="flex flex-col gap-0">
                                                                                        <h3 className="font-semibold  text-sm text-foreground/90">
                                                                                            {item?.product?.name}
                                                                                        </h3>
                                                                                        <p className="text-tiny text-foreground/80 mt-2">
                                                                                            {item?.product?.description.split(' ').slice(0, 10).join(' ')}...
                                                                                            <Link href={`/preview/${item?.product?.id}`} className="text-orange-500">
                                                                                                Preview
                                                                                            </Link>
                                                                                        </p>
                                                                                        <h1 className=" flex  justify-between text-sm font-medium mt-4">
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
                                                                                    <div className="flex items-center gap-1">
                                                                                        <p className='text-tiny'>size</p>
                                                                                        <ToggleGroup type="single" variant="outline"  
                                                                                        >
                                                                                            {
                                                                                                item?.product?.size?.map((item: any) => (
                                                                                                    <ToggleGroupItem
                                                                                                        key={item}
                                                                                                        value={item}
                                                                                                        className="w-3 h-6 "
                                                                                                    >
                                                                                                        <p className="text-tiny">  {item}</p>
                                                                                                    </ToggleGroupItem>
                                                                                                ))
                                                                                            }
                                                                                        </ToggleGroup>
                                                                                    </div>

                                                                                    <div className="flex items-center gap-2 ml-2">
                                                                                        <Button className="bg-white text-dark border border-black h-7 w-4 rounded-sm hover:bg-green-300" disabled={isLoading} onClick={() => {
                                                                                            session ? actionTocartFunction(item, "add") : dispatch(isLoginModel(false));
                                                                                        }}
                                                                                        >+</Button>
                                                                                        <p className='text-tiny'>{item?.qty}</p>
                                                                                        <Button className="bg-white text-dark border border-black h-7 w-2 rounded-sm  hover:bg-red-300" disabled={isLoading} onClick={() => {
                                                                                            session ? actionTocartFunction(item, "remove") : dispatch(isLoginModel(false));
                                                                                        }}
                                                                                        > -</Button>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                                // <li key={item.id} className="flex py-6">
                                                                //     <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">

                                                                //         <Image
                                                                //             src={`/products/${item?.product?.image}`} width={200} height={200}
                                                                //             alt=""
                                                                //             className="h-full w-full object-cover object-center"
                                                                //         />
                                                                //     </div>
                                                                //     <div className="ml-4 flex flex-1 flex-col">
                                                                //         <div>
                                                                //             <div className="flex justify-between text-base font-medium text-gray-900">
                                                                //                 <h3 className='text-black'>
                                                                //                     <a href={item.href}>{item?.product?.name}</a>
                                                                //                 </h3>
                                                                //                 <p className="ml-2 text-sm">{item?.qty} X {item?.product?.price} = {item?.qty * item?.product?.price} </p>
                                                                //                 {item?.size !== "NONE" ? <p className="ml-2 text-sm">Size: {item?.size} </p> : <p className="ml-2 text-sm"> </p>

                                                                //                 }

                                                                //             </div>
                                                                //         </div>

                                                                //         <div className="flex flex-1 items-end justify-between text-sm">

                                                                //             <button className='text-black' disabled={isLoading} onClick={() => {
                                                                //                 session ? actionTocartFunction(item, "remove") : dispatch(isLoginModel(false));
                                                                //             }}>-</button>

                                                                //             <p className="text-gray-500">{item?.qty}</p>

                                                                //             <button className='text-black' disabled={isLoading} onClick={() => {
                                                                //                 session ? actionTocartFunction(item, "add") : dispatch(isLoginModel(false));
                                                                //             }}>+</button>

                                                                //             <div className="flex">
                                                                //                 <button disabled={isLoading}
                                                                //                     onClick={() => {
                                                                //                         session ? actionTocartFunction(item, "delete") : dispatch(isLoginModel(false));
                                                                //                     }}
                                                                //                     type="button"
                                                                //                     className="font-medium text-indigo-600 hover:text-red-500"
                                                                //                 >
                                                                //                     Remove
                                                                //                 </button>
                                                                //             </div>
                                                                //         </div>
                                                                //     </div>
                                                                // </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Taxable Amount</p>
                                                    <p>₹ {taxableAmount}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                        onClick={() => {
                                                            if (session) {
                                                                dispatch(setOpenCart(!openCart))
                                                                router.push('/checkout/estimation')

                                                            } else {
                                                                errorToast("Please login first")
                                                            }
                                                        }}
                                                    >
                                                        Checkout
                                                    </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or {" "}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                                            onClick={() => dispatch(setOpenCart(!openCart))}
                                                        >
                                                            Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div >
                        </div >
                    </div >
                </Dialog >
            </Transition.Root >
        </div >

    )
}


