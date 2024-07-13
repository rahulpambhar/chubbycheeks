"use client";
import { Fragment, use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import Link from 'next/link';
import moment from "moment"
import { getReturnOrdersFunc } from '@/app/redux/slices/returnOrderSlice';


export default function Checkout() {
    const { data: session, status }: any = useSession();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const search = searchParams.get('wish')
    const orders: any[] = useAppSelector((state) => state?.orderReducer?.orders);
    const wishlist: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);
    const returnOrder: any[] = useAppSelector((state) => state?.returnOrderReducer.returnOrders);

    const [component, setComponent] = useState("Account");
    const [pegiLenght, setLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5

    const getOrders = async () => await dispatch(getOrdersFunc())
    const getReturnOrders = async () => await dispatch(getReturnOrdersFunc())

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders: any[] = component === "Orders" ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : component === "Wishlist" ? wishlist?.slice(indexOfFirstOrder, indexOfLastOrder) : component === "ReturnOrders" ? returnOrder?.slice(indexOfFirstOrder, indexOfLastOrder) : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        session && getOrders()
        session && getReturnOrders()
    }, [session])

    useEffect(() => {
        session && component === "Orders" ? setLength(orders.length) : component === "Wishlist" ? setLength(wishlist.length) : component === "ReturnOrders" ? setLength(returnOrder.length) : setLength(0)
    }, [session, orders, wishlist, returnOrder, component])

    useEffect(() => {
        session && search === "1" ? setComponent("Wishlist") : ""
    }, [session, search])

    console.log("hello")


    return (
        <>
            <div className="container border-t border-grey-dark">
                <div
                    className="flex flex-col justify-between pt-10 pb-16 sm:pt-12 sm:pb-20 lg:flex-row lg:pb-24">
                    <div className="lg:w-1/4">
                        <div className="flex flex-col pl-3">
                            <button onClick={(e) => setComponent("Account")} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk text-grey-darkest '>
                                Account
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("Wishlist") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk text-grey-darkest '>
                                Wishlist
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("Orders") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk font-bold text-primary border-primary '>
                                Orders
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("ReturnOrders") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk font-bold text-primary border-primary '>
                                ReturnOrders
                            </button>
                        </div>
                    </div>
                    {
                        component === "Account" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-10 px-6 sm:px-10">
                                <h1 className="font-hkbold mb-12 text-2xl text-secondary sm:text-left">
                                    Account Details
                                </h1>
                                {/* <div className="mb-12">
                                    <img
                                        src="/assets/img/unlicensed/blog-author.jpg"
                                        alt="user image"
                                        className="h-40 w-40 overflow-hidden rounded-full object-cover" />
                                </div> */}

                                <form>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="">
                                            <label htmlFor="first_name" className="mb-2 block font-hk text-secondary">Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value=""
                                                id="first_name" />
                                        </div>
                                        <div className="">
                                            <label htmlFor="email" className="mb-2 block font-hk text-secondary">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value=""
                                                id="email" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="">
                                            <label htmlFor="country_code" className="mb-2 block font-hk text-secondary">Country Code</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value=""
                                                id="country_code" />
                                        </div>
                                        <div className="">
                                            <label htmlFor="mobile" className="mb-2 block font-hk text-secondary">Mobile</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value=""
                                                id="mobile" />
                                        </div>
                                        <div className="">
                                            <label htmlFor="gender" className="mb-2 block font-hk text-secondary">Gender</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value=""
                                                id="gender" />
                                        </div>
                                    </div>

                                    <div className="my-8">
                                        <div>
                                            <h4 className="font-hkbold mb-2 text-xl text-secondary sm:text-left">
                                                Billing Address
                                            </h4>
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="w-full">
                                                    <label htmlFor="street" className="mb-2 block font-hk text-secondary">Street</label>
                                                    <input type="text" className="form-input" id="street" />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="street2" className="mb-2 block font-hk text-secondary">Street 2</label>
                                                    <input type="email" className="form-input" id="street2" />
                                                </div>
                                            </div>
                                            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                                                <div className="">
                                                    <label htmlFor="city" className="mb-2 block font-hk text-secondary">City</label>
                                                    <input type="text" className="form-input" id="city" />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="state" className="mb-2 block font-hk text-secondary">State</label>
                                                    <input type="email" className="form-input" id="state" />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="zip" className="mb-2 block font-hk text-secondary">Zip Code</label>
                                                    <input type="email" className="form-input" id="zip" />
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <label htmlFor="country" className="mb-2 block font-hk text-secondary">Country</label>
                                                <select className="form-select" id="country">
                                                    <option></option>
                                                    <option value="us">United States</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <button className="btn btn-primary" aria-label="Save button">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }

                    {
                        component === "Orders" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1
                                    className="font-hkbold pb-6 text-center text-2xl text-secondary sm:text-left">
                                    My Order's
                                </h1>
                                <div className="hidden sm:block">
                                    <div className="flex justify-between pb-3">
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Order Date & Time (In)</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Order Id</span>
                                        </div>
                                        <div className="w-1/4 text-center xl:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Items</span>
                                        </div>
                                        <div className="mr-3 w-1/6 text-center md:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Order value</span>
                                        </div>
                                        <div className="w-3/10 text-center md:w-1/5">
                                            <span className="font-hkbold pr-8 text-sm uppercase text-secondary md:pr-16 xl:pr-8">Status</span>
                                        </div>
                                    </div>
                                </div>
                                {currentOrders.map((order: any, index: number) => (
                                    <Link href={`/checkout/estimation/?orderID=${order.id}`}>
                                        <div
                                            key={index}
                                            className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4 transition duration-300 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div
                                                className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                                <span className="mt-2 font-hk text-base text-secondary">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                            </div>
                                            <div
                                                className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                                <span className="mt-2 font-hk text-base text-secondary">{order.id}</span>
                                            </div>
                                            <div
                                                className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                                <span className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Quantity</span>
                                                <span className="font-hk text-secondary">{order.itemCount}</span>
                                            </div>
                                            <div
                                                className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                                <span className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Price</span>
                                                <span className="font-hk text-secondary">${order.total}</span>
                                            </div>
                                            <div
                                                className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                                <div className="pt-3 sm:pt-0">
                                                    <span className="bg-primary-lightest border border-primary-light px-4 py-3 inline-block rounded font-hk text-primary">In Progress</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}


                                <div className="flex justify-center pt-6 md:justify-end">
                                    <span className="cursor-pointer pr-5 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage - 1)}>Previous</span>
                                    {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
                                        <span key={i} className="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-hk text-sm font-semibold text-black transition-colors hover:bg-primary hover:text-white" onClick={() => paginate(i + 1)}>{i + 1}</span>
                                    ))}
                                    <span className="cursor-pointer pl-2 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage + 1)}>Next</span>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        component === "Wishlist" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1
                                    className="font-hkbold pb-6 text-center text-2xl text-secondary sm:text-left">
                                    My Wishes
                                </h1>
                                <div className="hidden sm:block">
                                    <div className="flex justify-between pb-3">
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Wish Id</span>
                                        </div>
                                        <div className="w-1/4 text-center xl:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Item</span>
                                        </div>
                                        <div className="mr-3 w-1/6 text-center md:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary"> value</span>
                                        </div>
                                        <div className="w-3/10 text-center md:w-1/5">
                                            <span className="font-hkbold pr-8 text-sm uppercase text-secondary md:pr-16 xl:pr-8">Availability</span>
                                        </div>
                                    </div>
                                </div>

                                {currentOrders && currentOrders.map((order: any) => (
                                    <div
                                        className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">

                                        <div
                                            className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                            <span className="mt-2 font-hk text-base text-secondary">{order?.id}</span>
                                        </div>
                                        <div
                                            className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                            <span
                                                className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Quantity</span>
                                            <span className="font-hk text-secondary">{order?.itemCount}</span>
                                        </div>
                                        <div
                                            className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                            <span
                                                className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Price</span>
                                            <span className="font-hk text-secondary">${order?.netAmount}</span>
                                        </div>
                                        <div
                                            className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                            <div className="pt-3 sm:pt-0">
                                                <span className="bg-primary-lightest border border-primary-light px-4 py-3 inline-block rounded font-hk text-primary">In Progress</span>
                                            </div>
                                        </div>
                                    </div>))
                                }
                                <div className="flex justify-center pt-6 md:justify-end">
                                    <span className="cursor-pointer pr-5 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage - 1)}>Previous</span>
                                    {Array.from({ length: Math.ceil(pegiLenght / ordersPerPage) }, (_, i) => (
                                        <span key={i} className="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-hk text-sm font-semibold text-black transition-colors hover:bg-primary hover:text-white" onClick={() => paginate(i + 1)}>{i + 1}</span>
                                    ))}
                                    <span className="cursor-pointer pl-2 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage + 1)}>Next</span>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        component === "ReturnOrders" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1
                                    className="font-hkbold pb-6 text-center text-2xl text-secondary sm:text-left">
                                    Return Orders
                                </h1>
                                <div className="hidden sm:block">
                                    <div className="flex justify-between pb-3">
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Order Date & Time (In)</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Invoice No</span>
                                        </div>
                                        <div className="w-1/4 text-center xl:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Items</span>
                                        </div>
                                        <div className="mr-3 w-1/6 text-center md:w-1/5">
                                            <span className="font-hkbold text-sm uppercase text-secondary">Return Order value</span>
                                        </div>
                                        <div className="w-3/10 text-center md:w-1/5">
                                            <span className="font-hkbold pr-8 text-sm uppercase text-secondary md:pr-16 xl:pr-8">Status</span>
                                        </div>
                                    </div>
                                </div>

                                {currentOrders && currentOrders.map((order: any) => (<div
                                    className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">
                                    <div
                                        className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                        <span className="mt-2 font-hk text-base text-secondary">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                    </div>
                                    <div
                                        className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                        <span className="mt-2 font-hk text-base text-secondary">{order?.invoiceNo}</span>
                                    </div>
                                    <div
                                        className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                        <span className="font-hk text-secondary">{order?.itemCount}</span>
                                    </div>
                                    <div
                                        className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                        <span className="font-hk text-secondary">${order?.netAmount}</span>
                                    </div>
                                    <div
                                        className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                        <div className="pt-3 sm:pt-0">
                                            <span className="font-hk text-secondary">{order?.orderRerunrnStatus}</span>
                                        </div>
                                    </div>
                                </div>))
                                }
                                <div className="flex justify-center pt-6 md:justify-end">
                                    <span className="cursor-pointer pr-5 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage - 1)}>Previous</span>
                                    {Array.from({ length: Math.ceil(pegiLenght / ordersPerPage) }, (_, i) => (
                                        <span key={i} className="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full font-hk text-sm font-semibold text-black transition-colors hover:bg-primary hover:text-white" onClick={() => paginate(i + 1)}>{i + 1}</span>
                                    ))}
                                    <span className="cursor-pointer pl-2 font-hk font-semibold text-grey-darkest transition-colors hover:text-black" onClick={() => paginate(currentPage + 1)}>Next</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

