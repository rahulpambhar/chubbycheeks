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


export const actionTocartFunction_ = async (item: any, action: any, dispatch: any) => {

    try {
        const payload = { productId: item?.productId, action }
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
    let [subTotal, setSubTotal] = useState(0)
    const router = useRouter()

    const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
    const cartItem = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
    const isLoading = useAppSelector((state) => state?.cartReducer?.loading);

    const dispatch = useAppDispatch();

    const actionTocartFunction = (item: any, action: any) => actionTocartFunction_(item, action, dispatch)

    useEffect(() => {
        setSubTotal(
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
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {cartItem.map((item: any) => (
                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">

                                                                        {/* <img
                                                                            src={product.imageSrc}
                                                                            alt={product.imageAlt}
                                                                            className="h-full w-full object-cover object-center"
                                                                        /> */}
                                                                    </div>
                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3 className='text-black'>
                                                                                    <a href={item.href}>{item?.product?.name}</a>
                                                                                </h3>
                                                                                <p className="ml-4">{item?.qty} X {item?.product?.price} = {item?.qty * item?.product?.price} </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">

                                                                            <button className='text-black' disabled={isLoading} onClick={() => {
                                                                                session ? actionTocartFunction(item, "remove") : dispatch(isLoginModel(false));
                                                                            }}>-</button>

                                                                            <p className="text-gray-500">{item?.qty}</p>

                                                                            <button className='text-black' disabled={isLoading} onClick={() => {
                                                                                session ? actionTocartFunction(item, "add") : dispatch(isLoginModel(false));
                                                                            }}>+</button>

                                                                            <div className="flex">
                                                                                <button disabled={isLoading}
                                                                                    onClick={() => {
                                                                                        session ? actionTocartFunction(item, "delete") : dispatch(isLoginModel(false));
                                                                                    }}
                                                                                    type="button"
                                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>$ {subTotal}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                        onClick={() => {
                                                            if (session) {
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
                                                        or
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
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div >

    )
}


