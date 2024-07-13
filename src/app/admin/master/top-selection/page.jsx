'use client';
// import { dataNotFound } from "@/assets";
import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/admin/breadcrumb";
import { NumericFormat } from "react-number-format";

import ReactPaginate from "react-paginate";
import { dataNotFound, } from "../../../../../public/assets";
import Loading from "@/components/admin/loading";
import axios from "axios";
import moment from "moment";
import { apiUrl } from "../../../../../env";
import { successToast, errorToast } from "../../../../components/toster/index";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../redux/slices/categorySlice';
import toast from "react-hot-toast";
// import { ProductsData } from "@/components/frontside/DummyData";


export default function TopSelection() {


    const [isLoading, setIsLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({});
    const [selectFilter, setSelectFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [boolGetfilterCategory, setBoolGetfilterCategory] = useState(false);
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);


    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));



    const handleTopselection = (id,action) => {
        setIsLoading(true);

        try {
            axios.post(`${apiUrl}/admin/topSelection`, { id ,action}).then((response) => {
                if (response.data.st === true) {
                    successToast(response.data.msg);
                    setIsLoading(false);
                    getproductList();
                } else {
                    errorToast(response.data.msg);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            errorToast(error);
            setIsLoading(false);
        }
    };



    const getproductList = useCallback(async () => {
        setLoader(true);
        try {
            let response = await axios.get(`${apiUrl}/admin/products?page=${page}&limit=${perPage}&slug=getproductList`);

            if (response?.data.data) {
                setData(response?.data?.data);
                setPageCount(response?.data?.total_pages);
                setCurrentPage(response?.data?.current_page);

                setLoader(false);
            } else {
                setLoader(false);
            }
        } catch (error) {
            errorToast(error);
            setLoader(false);
        }
    }, [page, perPage]);

    const getfilterCategory = async () => {
        try {
            let response = await axios.get(`${apiUrl}/admin/products?page=${page}&limit=${perPage}&categoryId=${selectFilter}&slug=getCategoryProducts`);

            if (response?.data.data) {
                setData(response?.data?.data);
                setPageCount(response?.data?.total_pages);
                setCurrentPage(response?.data?.current_page);

            } else {
                errorToast(response.data.msg);

            }
        } catch (error) {
            errorToast(error);
        }
    }

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        getproductList();
    }, [perPage, page,]);

    useEffect(() => {
        if (boolGetfilterCategory === true) {
            getfilterCategory()
        } else {
            setBoolGetfilterCategory(true)
        }
    }, [selectFilter]);

    return (
        <div className="container">
            {/* <Breadcrumb /> */}
            <div className="filter-section position flex justify-between items-center py-5 ">
                <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="  block w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

            </div>
            <div className=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg ">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-200 dark:bg-gray-900">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative ml-auto">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search for category"
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Video
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Updated At
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Top-Select
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Set-new
                            </th>

                        </tr>
                    </thead>

                    <tbody >
                        {
                            data.length > 0 ? data?.map((item, index) => (
                                <tr key={item.id} className="bg-gray-200  h-[20px] border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">

                                    <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                        <h6 className="font-normal text-gray-500">{`${item?.id?.slice(0, 3)}...${item?.id.slice(-4)}`}</h6>

                                    </th>
                                    <td className="px-6 py-3">
                                        <div className="font-normal text-gray-500">{item?.name}</div>
                                    </td>
                                    <td className=" px-6 ">
                                        {
                                            item?.image === null ? <div className="font-normal text-gray-500">No Image</div> :
                                                <Image className="w-10 h-10 border border-black rounded" src={`/products/${item?.image[0]}`} alt="Jese image" width={100} height={100} />
                                        }
                                    </td>
                                    <td className=" px-6 ">
                                        <Image className="w-10 h-10 border border-black rounded" src={`/catagory/${item?.image}`} alt="Jese image" width={100} height={100} />
                                    </td>

                                    <td className="px-6 ">
                                        <div className="font-normal text-gray-500">{moment(item?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</div>
                                    </td>
                                    <td className="px-6 ">
                                        <div className="font-normal text-gray-500">{moment(item?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</div>
                                    </td>
                                    <td className="px-6 ">
                                        <input
                                            checked={item?.topSelected}
                                            className="btn btn-danger"
                                            type="checkbox"
                                            onChange={e => handleTopselection(item?.id,"topSelected")}
                                        />
                                    </td>
                                    <td className="px-6 ">
                                        <input
                                            checked={item?.isNew}
                                            className="btn btn-danger"
                                            type="checkbox"
                                            onChange={e => handleTopselection(item?.id,"isNew")}
                                        />
                                    </td>
                                </tr>
                            ))
                                :
                                <tr className="justify-auto h-full">
                                    <td colSpan={6} className="text-center">
                                        <div className="flex justify-center items-center">
                                            <Image
                                                width={100}
                                                height={100}
                                                src={dataNotFound}
                                                alt="Data not found"
                                            />
                                        </div>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>

                <div className="flex flex-col mt-3">
                    <div id="pagination" className="mt-3">
                        <div className="pagination-list">
                            <nav aria-label="Page navigation example">
                                <ReactPaginate
                                    breakLabel="..."
                                    breakClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    breakLinkClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    containerClassName="flex justify-center space-x-1"
                                    pageClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    pageLinkClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    previousClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    previousLinkClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    nextClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    nextLinkClassName="inline-block px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                                    marginPagesDisplayed={2}
                                    nextLabel={
                                        <>
                                            Next{" "}
                                            <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                        </>
                                    }
                                    onPageChange={(e) => setPage(e.selected + 1)}
                                    pageRangeDisplayed={5}
                                    pageCount={pageCount}
                                    previousLabel={
                                        <>
                                            <i className="fa fa-angle-double-left" aria-hidden="true"></i>{" "}
                                            Prev
                                        </>
                                    }
                                    renderOnZeroPageCount={null}
                                />

                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}