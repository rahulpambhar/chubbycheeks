"use client";
import React from 'react'
import { errorToast, successToast } from '@/components/toster';
import moment from "moment"
import Pagination from 'react-js-pagination';
import Dropdown from '@/components/frontside/Dropdown/returnOrders'
import { FaCopy } from 'react-icons/fa';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { getStatusClass } from "@/app/utils"
const MyReturnOrders = ({ currentOrders, getOrders, ordersPerPage, handlePageChange, pegiLenght, currentPage }: any) => {


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
                    My Return Order's
                </h1>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-left">Order Id</TableHead>
                            <TableHead className='text-left'>Order Date</TableHead>
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
                                    <h6 className=" text-tiny font-bold">{moment(item.createdAt).format('DD-MM-YYYY')}</h6>
                                    <h6 className="text-tiny ">{item?.createdAt ? moment(item?.createdAt).format('HH:mm:ss') : ""}</h6>
                                </TableCell>

                                <TableCell className="text-left">{item.itemCount}</TableCell>

                                <TableCell className="text-left">{item.netAmount}</TableCell>

                                <TableCell className="text-left">{item.paymentMethod}</TableCell>

                                <TableCell className="text-left">
                                    <span className={`font-normal ${getStatusClass(item?.orderStatus)} rounded px-2 py-1`}>{item?.orderStatus}</span>

                                </TableCell>
                                <TableCell className="text-left">
                                    <Dropdown item={item} getOrders={getOrders} />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
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
            </div>
        </div>


        // <div className="mt-12 lg:mt-0 lg:w-3/4 ">
        //     <div className="bg-grey-light py-8 px-5 md:px-8">
        //         <h1 className="font-hkbold pb-6 text-center text-2xl  sm:text-left">
        //             My Return Orders
        //         </h1>
        //         <div className="hidden sm:block">
        //             <div className="flex justify-between pb-3">
        //                 <div className="w-1/3 pl-4 md:w-2/5">
        //                     <span className="font-hkbold text-sm uppercase ">Order Date & Time (In)</span>
        //                 </div>
        //                 <div className="w-1/3 pl-4 md:w-2/5">
        //                     <span className="font-hkbold text-sm uppercase ">Invoice No</span>
        //                 </div>
        //                 <div className="w-1/4 text-center xl:w-1/5">
        //                     <span className="font-hkbold text-sm uppercase ">Items</span>
        //                 </div>
        //                 <div className="mr-3 w-1/6 text-center md:w-1/5">
        //                     <span className="font-hkbold text-sm uppercase ">Return Order value</span>
        //                 </div>
        //                 <div className="w-3/10 text-center md:w-1/5">
        //                     <span className="font-hkbold pr-8 text-sm uppercase  md:pr-16 xl:pr-8">Status</span>
        //                 </div>
        //             </div>
        //         </div>

        //         {currentOrders && currentOrders?.map((order: any) => (<div
        //             className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">
        //             <div
        //                 className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
        //                 <span className="mt-2 font-hk text-base ">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        //             </div>
        //             <div
        //                 className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
        //                 <span className="mt-2 font-hk text-base ">{order?.invoiceNo}</span>
        //             </div>
        //             <div
        //                 className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
        //                 <span className="font-hk ">{order?.itemCount}</span>
        //             </div>
        //             <div
        //                 className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
        //                 <span className="font-hk ">₹{order?.netAmount}</span>
        //             </div>
        //             <div
        //                 className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
        //                 <div className="pt-3 sm:pt-0">
        //                     <span className="font-hk ">{order?.orderRerunrnStatus}</span>
        //                 </div>
        //             </div>
        //         </div>))
        //         }
        //         <div className="flex justify-center pt-6 md:justify-end">
        //             <Pagination
        //                 activePage={currentPage}
        //                 itemsCountPerPage={ordersPerPage}
        //                 totalItemsCount={pegiLenght}
        //                 pageRangeDisplayed={5}
        //                 onChange={handlePageChange}
        //                 itemClass="page-item"
        //                 linkClass="page-link"
        //                 activeClass="active"
        //             />
        //         </div>
        //     </div>
        // </div>
    )
}

export default MyReturnOrders