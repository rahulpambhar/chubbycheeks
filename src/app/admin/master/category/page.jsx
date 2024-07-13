/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Breadcrumb from "@/components/admin/breadcrumb";
import Image from "next/image";
import { use, useCallback, useEffect, useState } from "react";
import { dataNotFound } from "../../../../../public/assets";
import Loading from "@/components/admin/loading";
import ReactPaginate from "react-paginate";
import axios from "axios";
import moment from "moment";
import { apiUrl } from "../../../../../env";
import { successToast, errorToast } from "../../../../components/toster/index";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCategories } from '../../app/redux/slices/categorySlice';

export default function DashBoardPage() {
  //   const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({});
  console.log(data)
  const [modelToggle, setModelToggle] = useState(false);
  const [input, setInput] = useState({});
  const [image, setImage] = useState(null);
  const [addOrUpdate, setAddOrUpdate] = useState("");
  const [categoryId, sercategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteId, setDeleteId] = useState([]);
  const [deleteToggle, setDeleteToggle] = useState(false);

  const addOrUpdateCatagoery = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!input.name) {
      errorToast("Please enter category name");
      setIsLoading(false);
      return;
    } else if (!image && addOrUpdate === "add") {
      errorToast("Please select image");
      setIsLoading(false);
      return;
    }
    try {
      let formData = new FormData();
      formData.append("name", input.name);
      formData.append("image", image);
      formData.append("type", addOrUpdate);
      formData.append("categoryId", categoryId);

      let response = await axios.post(`${apiUrl}/admin/category`, formData);

      if (response.data.st === true) {
        getCategoryList();
        successToast(response.data.msg);
        setData(response.data.data);
        setIsLoading(false);
        setInput({});
        setImage(null);

        if (addOrUpdate === "update") {
          setModelToggle(false);
          sercategoryId("");
        }
      } else {
        errorToast(response.data.msg);
        setIsLoading(false);
      }
    } catch (error) {
      errorToast(error);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (data) => {
    const indexToDelete = deleteId.indexOf(data);

    if (indexToDelete !== -1) {
      const newArrey = deleteId.filter((item, index) => item !== data);
      setDeleteId(newArrey);
    } else {
      setDeleteId([...deleteId, data]);
    }
  };

  const deleteCategory = () => {
    try {
      axios
        .delete(`${apiUrl}/admin/category`, { data: { categoryIds: deleteId } })
        .then((response) => {
          if (response.data.st === true) {
            getCategoryList();
            successToast(response.data.msg);
            setDeleteToggle(false);
            setDeleteId([]);
          } else {
            errorToast(response.data.msg);
          }
        });
    } catch (error) {
      errorToast(error);
    }
  };

  const getCategoryList = async () => {
    setLoader(true);
    try {
      let response = await axios.get(
        `${apiUrl}/admin/category?page=${page}&limit=${perPage}`
      );

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
  };

  useEffect(() => {
    getCategoryList();
  }, [perPage, page]);

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

        <div className="flex gap-5  ">
          {" "}
          <button
            type="button"
            className="filter-btn flex gap-1"
            onClick={(e) => {
              setModelToggle(true);
              setAddOrUpdate("add");
            }}
          >
            Add
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="left-margin-10"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.375 2.5H3.125V8.75H4.375V2.5ZM12 8.75H8L7.5 8.0625V6.8125L8 6.25H12L12.5 6.875V8.125L12 8.75ZM5.75 12.5H1.75L1.25 11.875V10.625L1.75 10H5.75L6.25 10.625V11.875L5.75 12.5ZM10.625 2.5H9.375V5H10.625V2.5ZM9.375 10H10.625V17.5H9.375V10ZM4.375 13.75H3.125V17.5H4.375V13.75ZM14.25 13.75H18.2375L18.7375 13.125V11.9375L18.2375 11.3125H14.25L13.75 11.9375V13.125L14.25 13.75ZM16.875 2.5H15.625V10H16.875V2.5ZM15.625 15H16.875V17.5H15.625V15Z"
                fill="#CEA666"
              />
            </svg>
          </button>
          <button type="button" className="filter-btn flex gap-1">
            Delete Multiple
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="left-margin-10"
              onClick={(e) => {
                if (deleteId.length > 0) {
                  setDeleteToggle(true);
                } else {
                  errorToast("categorys not selected");
                }
              }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.375 2.5H3.125V8.75H4.375V2.5ZM12 8.75H8L7.5 8.0625V6.8125L8 6.25H12L12.5 6.875V8.125L12 8.75ZM5.75 12.5H1.75L1.25 11.875V10.625L1.75 10H5.75L6.25 10.625V11.875L5.75 12.5ZM10.625 2.5H9.375V5H10.625V2.5ZM9.375 10H10.625V17.5H9.375V10ZM4.375 13.75H3.125V17.5H4.375V13.75ZM14.25 13.75H18.2375L18.7375 13.125V11.9375L18.2375 11.3125H14.25L13.75 11.9375V13.125L14.25 13.75ZM16.875 2.5H15.625V10H16.875V2.5ZM15.625 15H16.875V17.5H15.625V15Z"
                fill="#CEA666"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
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
                CategoryId
              </th>
              <th scope="col" className="px-6 py-3">
                Category Name
              </th>

              <th scope="col" className="px-6 py-3">
                image
              </th>
              <th scope="col" className="px-6 py-3">
                createdAt
              </th>
              <th scope="col" className="px-6 py-3">
                updatedAt
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>

              <th scope="col" className="px-6 py-3">
                update
              </th>
            </tr>
          </thead>
          <tbody>
            {
              data.length > 0 ? data?.map((item, index) => (
                <tr key={item.id} className="bg-gray-200  h-[20px] border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">

                  <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="font-normal text-gray-500">{item?.id}</div>
                  </th>

                  <td className="px-6 ">
                    <div className="font-normal text-gray-500">{item?.name}</div>
                  </td>



                  <td className="px-6 ">
                    <Image className="w-10 h-10 border border-black rounded" src={`/catagory/${item?.image}`} alt="Jese image" width={100} height={100} />

                  </td>

                  <td className="px-6 ">
                    <div className="font-normal text-gray-500">  {moment(item?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</div>
                  </td>

                  <td className="px-6 ">
                    <div className="font-normal text-gray-500">  {moment(item?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</div>
                  </td>
                  <td className="px-6 ">
                    <div className="font-normal text-gray-500">
                      <input
                        className="w-5 h-5 border border-black rounded"
                        type="checkbox"
                        // checked={isChecked}
                        onChange={(e) => handleCheckboxChange(item?.id)}
                      />
                    </div>
                  </td>


                  <td className="px-6 ">
                    {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                     */}
                    <button
                      type="button"
                      className="edit-btn"
                      aria-label="i"
                      onClick={(e) => {
                        sercategoryId(item?.id);
                        setAddOrUpdate("update");
                        setInput({
                          ...input,
                          name: item?.name,
                        });
                        setModelToggle(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>

                </tr>
              )
              )
                : <tr>
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

      <div className=" mb-4">
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-700 ${modelToggle ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          <div className="relative w-full max-w-lg p-4 bg-white rounded-md shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
              <h5 className="text-lg font-medium dark:text-white">Modal Title</h5>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  setInput({});
                  setImage(null);
                  setModelToggle(false);
                }}
              >
                <span className="sr-only">Close modal</span>
                &times;
              </button>
            </div>
            <div className="p-4">
              <form method="post">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="form-group mb-2">
                    <label htmlFor="inputName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Category Name
                    </label>
                    <input
                      value={input?.name || ""}
                      type="text"
                      className="block w-full px-3 py-2 text-sm border rounded-lg dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="inputName"
                      placeholder="Name"
                      name="name"
                      onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="inputPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      className="block w-full px-3 py-2 text-sm border rounded-lg dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="inputPhone"
                      name="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    className={`px-4 py-2 text-white bg-gray-500 rounded-lg ${isLoading ? 'cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                    onClick={addOrUpdateCatagoery}
                  >
                    {isLoading ? "Loading..." : addOrUpdate === "add" ? "Add" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
