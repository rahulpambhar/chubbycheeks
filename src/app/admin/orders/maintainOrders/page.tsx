"use client";
// import BreadCrum bs from "@/components/server_components/BreadCrumbs";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
// import TableNoRecord from "@/components/GlobalComponents/NoRecord";
// import Loader from "@/components/server_components/Loader";
// import PaginationComponent from "@/components/FormFields/PaginationComponent";
// import TableFunctionality from "@/components/FormFields/TableFunctionality";
// import TableParentDiv from "@/components/FormFields/TableParentDiv";
import { IoMenuOutline } from "react-icons/io5";
function Page() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    return (
        <div className="h-full overflow-y-auto scrollbar-remove shadow-inner relative">

            <div className="flex flex-col h-[calc(100%-57px)] overflow-hidden divUtils !rounded-none">
                {/* <TableFunctionality
                    setPaginateValue={setPaginateValue}
                    paginateValue={paginateValue}
                    setSearching={setSearching}
                    setSorting={setSorting}
                    sorting={sorting}
                /> */}
                <div className="overflow-auto h-full shadow-inner horizontal-scroll">
                    <div className="min-w-full inline-block align-middle relative">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead>
                                <tr className="bg-[--table-h] text-[--dark-text] border-collapse font-extrabold sticky top-0 inset-x-0 z-[1]">
                                    <th
                                        scope="col"
                                        className="px-6 w-[80px] py-3 text-start text-small whitespace-nowrap font-bold capitalize border border-[--background]"
                                    >
                                        Index
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-small whitespace-nowrap font-bold capitalize border border-[--background]"
                                    >
                                        HSN Code
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-small whitespace-nowrap font-bold capitalize border border-[--background]"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-start text-small whitespace-nowrap font-bold capitalize border border-[--background]"
                                    >
                                        Tax
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 w-[80px] py-3 text-start text-small whitespace-nowrap font-bold capitalize border border-[--background]"
                                    >
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7}>
                                            {/* <Loader /> */}
                                        </td>
                                    </tr>
                                ) : data?.length > 0 ? (
                                    data?.map((ele: any) => (
                                        <tr
                                            key={ele?.id}
                                            className="border-collapse hover:bg-[--table-hover]"
                                        >
                                            <td className="px-6 py-2 whitespace-nowrap text-small border border-[--border] font-medium text-gray-800 ">
                                                {ele?.id}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-small border border-[--border] text-gray-800 cursor-pointer">
                                                <Link href={`/${ele?.ID}`}>{ele?.code}</Link>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-small border border-[--border] text-gray-800 ">
                                                {ele?.description}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-small border border-[--border] text-gray-800 ">
                                                {ele?.igst}
                                            </td>
                                            <td
                                                className="px-6 w-[80px] py-2 whitespace-nowrap text-end text-small font-medium border border-[--border] relative"
                                            // onClick={() => setselectedUser(ele.id)}
                                            >
                                                <IoMenuOutline onClick={() => {
                                                    // setThreeDot(ele.id);
                                                }} />
                                                {/* {ThreeDot === ele.id && (
                                                    <div
                                                        ref={ref}
                                                        className="absolute top-[40px] right-0 bg-white z-40 shadow-lg w-full min-w-[90px] rounded-sm border border-[--humber-active] cursor-pointer"
                                                    >
                                                        <div className="flex flex-col divide-y-[1px]">
                                                            <button
                                                                onClick={() => {
                                                                    // setModalCreate(!modalCreate);
                                                                    // setThreeDot(0);
                                                                }}
                                                                className="w-full text-small px-3 py-2 font-normal text-[--grey]"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="w-full text-small px-3 py-2 font-normal text-[--grey]"
                                                                onClick={() => {
                                                                    // setModalDelete(!modalDelete);
                                                                    // setThreeDot(0);
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )} */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="">
                                        <td colSpan={7}>
                                            <div className="p-[30px] text-center   w-full mx-0 flex justify-center">
                                                <Image src="" width={200} height={200} alt="" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-between items-center border border-[--humber-active] px-1 md:px-3 border-s-0 border-e-0 py-1">
                    <div className="text-start">
                        <p className="text-small text-[--dark-text]">
                            {/* Showing {totalPages === 0 ? 0 : pageNumber} of {totalPages} results */}
                        </p>
                    </div>
                    <div className="flex justify-end items-center px-3 gap-2 inset-x-0 bottom-0">
                        <button
                            onClick={() => {
                                // pageNumber > 1 ? setPageNumber(pageNumber - 1) : setPageNumber(1);
                            }}
                            // disabled={pageNumber === 1}
                            className="min-h-[30px]  py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-small  rounded-lg text-gray-800 hover:bg-[--background] focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none md:min-w-[38px]"
                        >
                            Prev
                        </button>
                        {/* {pagination} */}
                        <button
                            // onClick={() => setPageNumber(pageNumber + 1)}
                            // disabled={pageNumber === totalPages}
                            className="min-h-[30px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-small rounded-lg text-gray-800 hover:bg-[--background] focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none md:min-w-[38px]"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
