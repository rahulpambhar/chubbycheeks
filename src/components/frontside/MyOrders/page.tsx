"use client";
import React, { useState } from 'react'
import { errorToast, successToast } from '@/components/toster';
import moment from "moment"
import Pagination from 'react-js-pagination';
import Dropdown from '@/components/frontside/Dropdown/page'
import { FaCopy } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../../app/redux/hooks';
import { createTempOrderFunc, updateOrdersFunc, getOrdersFunc } from '../../../app/redux/slices/orderSlices';
import { DateRange } from "react-day-picker"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { getStatusClass } from "@/app/utils"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const MyOrders = ({ currentOrders, getOrders, ordersPerPage, handlePageChange, pegiLenght, currentPage }: any) => {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1)
    const [perPage, setperPage] = useState(25)
    const [searchOrder, setSearch] = useState("")
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [date, setDate] = useState<DateRange | undefined>({ from: oneMonthAgo, to: today, })

    const getOrderSearch = async (search: string) => await dispatch(getOrdersFunc({ page: page, limit: perPage, search: search, from: date?.from?.toString(), to: date?.to?.toString(), slug: "getPaginated", }))

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            successToast('copied to clipboard');
        }).catch((err) => {
            errorToast('Failed to copy address');
        });
    };

    return (
        <div className="mt-12 lg:mt-0 lg:w-3/4  ">
            <div className="bg-grey-light py-8 px-5 md:px-8">
                <h1
                    className="font-hkbold pb-6 text-center text-2xl  sm:text-left text text-black">
                    My Order's
                </h1>
                <Table>
                    <TableCaption>{currentOrders?.length > 0 ? "A list of your recent invoices... " : "No orders found "}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-left">Order Id</TableHead>
                            <TableHead className="w-[100px] text-left">Invoice No</TableHead>
                            <TableHead className='text-left'>Order Date</TableHead>
                            <TableHead className='text-left'>Expected Date</TableHead>
                            <TableHead className='text-left'>Items</TableHead>
                            <TableHead className='text-left'>Amount</TableHead>
                            <TableHead className='text-left'>PAYMENT</TableHead>
                            <TableHead className='text-left'>Status</TableHead>
                            <TableHead className='text-left'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentOrders && currentOrders?.map((item: any, index: number) => (
                            <TableRow>
                                <TableCell className="font-medium ">
                                    <span className='flex'>
                                        <h6>{`${item?.id?.slice(0, 3)}...${item?.id.slice(-4)}`}</h6>
                                        <FaCopy className="ml-2 cursor-pointer text-blue-500" onClick={() => handleCopy(item.id)} title="Copy to clipboard" />
                                    </span>
                                </TableCell>
                                <TableCell className='w-32 text-left'>
                                    <h6 className="text-tiny font-bold ">{item?.invoiceNo}</h6>
                                </TableCell>
                                <TableCell className='w-32 text-left'>
                                    <h6 className=" text-tiny font-bold">{moment(item.createdAt).format('DD-MM-YYYY')}</h6>
                                    <h6 className="text-tiny ">{item?.createdAt ? moment(item?.createdAt).format('HH:mm:ss') : ""}</h6></TableCell>
                                <TableCell className='w-32 text-left'>
                                    <h6 className="text-tiny font-bold ">{item?.expectedDate ? moment(item?.expectedDate).format('YYYY-MM-DD') : "-"}</h6>
                                </TableCell>
                                <TableCell className="text-left">{item.itemCount}</TableCell>

                                <TableCell className="text-left">{item.netAmount}</TableCell>

                                <TableCell className="text-left">{item.paymentMethod}</TableCell>

                                <TableCell className="text-left">
                                    <span className={`font-normal ${getStatusClass(item?.orderStatus)} rounded px-2 py-1`}>{item?.orderStatus}</span>

                                </TableCell>
                                <TableCell className="text-left">  <Dropdown item={item} getOrders={getOrders} /></TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                {currentOrders?.length > 0 &&
                    <div className="flex justify-center pt-6 md:justify-end">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={ordersPerPage}
                            totalItemsCount={pegiLenght}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="active"
                        />
                    </div>
                }
            </div>
        </div >
    )
}

export default MyOrders