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
import Select from 'react-select';
import toast from "react-hot-toast";
// import { ProductsData } from "@/components/frontside/DummyData";


export default function BuyHistory() {


    const [isLoading, setIsLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({});
    const [modelToggle, setModelToggle] = useState(false);
    const [productsId, setProductId] = useState("");
    const [selectFilter, setSelectFilter] = useState("");
    const [updateImageIds, setUpdateImageIds] = useState([]);
    const [updateImages, setUpdateImages] = useState({});
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [deleteId, setDeleteId] = useState([]);
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [boolGetfilterCategory, setBoolGetfilterCategory] = useState(false);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const maxDiscount = 30


    const [addProductData, setAddProductData] = useState({
        name: "",
        batchNo: "",
        uid: "",
        price: 0,
        han: 0,
        discountedPrice: 0,
        discount: 0,
        brand: "",
        qty: 0,
        description: "",
        avgRating: 0,
        numReviews: 0,
        image: null,
        video: null,
        categoryId: "",
        subCategoryId: "",
        discountType: "PERCENTAGE",
        type: "",
    });

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const addOrUpdateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { categoryId, subCategoryId, name, batchNo, uid, price, description, discount, image, video, discountedPrice, brand, qty, type, hsn, discountType } = addProductData
        if (categoryId === "" && type === "add") {
            errorToast("Please select category");
            setIsLoading(false);
            return;
        } else if (subCategoryId === "" && type === "add") {
            errorToast("Please select sub category");
            setIsLoading(false);
            return;
        } else if (name === "") {
            errorToast("Please enter product name");
            setIsLoading(false);
            return;
        } else if (batchNo === "") {
            errorToast("Please enter batch no");
            setIsLoading(false);
            return;
        } else if (uid === "") {
            errorToast("Please enter uid");
            setIsLoading(false);
            return;
        } else if (price === 0) {
            errorToast("Please enter price");
            setIsLoading(false);
            return;
        } else if (discountedPrice === 0 || discount === 0) {
            errorToast("enter discount or disounted price")
            setIsLoading(false);
        } else if (description === "") {
            errorToast("Please enter description");
            setIsLoading(false);
            return;
        } else if (brand === "") {
            errorToast("enter brand")
            setIsLoading(false);
            return
        } else if (qty === 0) {
            errorToast("enter qty")
            setIsLoading(false);
            return
        } else if (image === null && type === "add") {
            errorToast("select images")
            setIsLoading(false);
            return

        } else if (video === null && type === "add") {
            errorToast("select video")
            setIsLoading(false);
            return
        }


        try {
            let formData = new FormData();
            formData.append("categoryId", categoryId);
            formData.append("subCategoryId", subCategoryId);
            formData.append("name", name);
            formData.append("batchNo", batchNo);
            formData.append("uid", uid);
            formData.append("price", price);
            formData.append("discountedPrice", discountedPrice);
            formData.append("discount", discount);
            formData.append("description", description);
            formData.append("brand", brand);
            formData.append("discountType", discountType);
            formData.append("hsn", hsn);
            formData.append("qty", qty);

            if (type === "add") {
                for (const x of image) {
                    formData.append('image', x);
                }
            } else {
                for (const x of updateImages) {
                    formData.append('image', x);
                }
                formData.append("updateImageIds", updateImageIds);
                formData.append("productsId", productsId);
            }

            formData.append("video", video);
            formData.append("type", type);

            let response = await axios.post(`${apiUrl}/admin/products`, formData);

            if (response.data.st === true) {
                setIsLoading(false);
                getproductList()
                if (addProductData.type === "update") {
                    toast.success(response.data.msg);
                    setModelToggle(false);
                    setAddProductData({
                        name: "",
                        batchNo: "",
                        uid: "",
                        price: 0,
                        han: 0,
                        discountedPrice: 0,
                        discount: 0,
                        brand: "",
                        qty: 0,
                        description: "",
                        avgRating: 0,
                        numReviews: 0,
                        image: null,
                        video: null,
                        categoryId: "",
                        subCategoryId: "",
                        discountType: "PERCENTAGE",
                        type: "",
                    });
                    setModelToggle(false);
                    setDeleteId([]);
                    setUpdateImageIds([])
                    setProductId("")
                    setUpdateImages({})
                } else {
                    toast.success(response.data.msg);
                    setModelToggle(false);
                    setAddProductData({
                        name: "",
                        batchNo: "",
                        uid: "",
                        price: 0,
                        discountedPrice: 0,
                        discount: 0,
                        brand: "",
                        qty: 0,
                        description: "",
                        avgRating: 0,
                        numReviews: 0,
                        image: null,
                        video: null,
                        categoryId: "",
                        subCategoryId: "",
                        discountType: "",
                        hsn: "",
                        type: "add",
                    });

                }
            } else {
                errorToast(response.data.msg);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error)
            errorToast(error);
            setIsLoading(false);
        }
    }


    const handleCheckboxChange = (data) => {
        const indexToDelete = deleteId.indexOf(data);

        if (indexToDelete !== -1) {
            const newArrey = deleteId.filter((item, index) => item !== data);
            setDeleteId(newArrey)
        } else {
            setDeleteId([...deleteId, data]);
        }
    };

    const deleteProducts = () => {
        setIsLoading(true);

        try {
            axios.delete(`${apiUrl}/admin/products`, { data: { productIds: deleteId } }).then((response) => {
                if (response.data.st === true) {
                    getproductList()
                    successToast(response.data.msg);
                    setDeleteToggle(false);
                    setDeleteId([]);
                    setIsLoading(false);
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

    const setSubCategorySelect = (val) => {
        const subCategory = categories.filter((item) => item.id === val);
        setAddProductData({
            ...addProductData,
            categoryId: val,
        });
        setSubCatOptions(
            subCategory[0].SubCategory.map((subcategory) => ({
                value: subcategory.id,
                label: subcategory.name,
            }))
        );
    }

    const handleImageClick = (selectedImage) => {
        setUpdateImageIds((prevImages) => {
            if (prevImages.includes(selectedImage)) {
                return prevImages.filter(image => image !== selectedImage);
            } else {
                return [...prevImages, selectedImage];
            }
        });
    };

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        getproductList();
    }, [perPage, page,]);

    useEffect(() => {
        if (boolGetfilterCategory === true) {
            getfilterCategory()
        }else{
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
                <div className="flex gap-5  ">
                    <button type="button" className="filter-btn flex gap-1">
                        Add
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="left-margin-10"
                            onClick={(e) => {
                                setAddProductData({
                                    ...addProductData,
                                    type: "add",
                                });
                                setModelToggle(true)
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
                    <button type="button" className="filter-btn flex gap-1   ">
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
                                    setDeleteToggle(true)
                                } else {
                                    errorToast("product not selected");
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
                    <div className="filter-btn flex gap-1 h-3">
                        <Select
                            className="left-margin-10"
                            id="dropdown"
                            placeholder={"filter category"}
                            options={categoryOptions}
                            onChange={(e) => {
                                setSelectFilter(e.value)
                            }}
                        />
                    </div>
                </div>
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
                                Delete
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Update
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
                                            className="btn btn-danger"
                                            type="checkbox"
                                            onChange={e => handleCheckboxChange(item?.id)}
                                        />
                                    </td>
                                    <td className="px-6 ">
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            aria-label="i"
                                            onClick={(e) => {
                                                const { name, batchNo, uid, price, discountedPrice, discount, brand, qty, description, image, video, categoryId, subCategoryId, hsn, discountType } = item
                                                setAddProductData({
                                                    // ...ProductsData,
                                                    name,
                                                    batchNo,
                                                    uid,
                                                    price,
                                                    discountedPrice: (discount * price) / 100,
                                                    discount,
                                                    brand,
                                                    qty,
                                                    description,
                                                    avgRating: 0,
                                                    numReviews: 0,
                                                    image,
                                                    video,
                                                    hsn,
                                                    discountType,
                                                    categoryId,
                                                    subCategoryId,
                                                    type: "update",
                                                });
                                                setModelToggle(true);
                                                setProductId(item?.id);
                                                setUpdateImages(item?.image);
                                            }}
                                        >
                                            Edit
                                        </button>
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
            {
                modelToggle &&
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Product Details</h3>
                                    <div className="mt-2">
                                        <form method="post">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="form-group mb-2">
                                                    {addProductData.type === 'add' ? (
                                                        <>

                                                            <Select
                                                                id="dropdown"
                                                                placeholder={'Select category'}
                                                                options={categoryOptions}
                                                                onChange={(e) => {
                                                                    setSubCategorySelect(e.value);
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-700">{`Category Id : ${addProductData.categoryId}`}</p>
                                                    )}
                                                </div>
                                                <div className="form-group mb-2">
                                                    {addProductData.type === 'add' ? (
                                                        <>

                                                            <Select
                                                                id="dropdown"
                                                                placeholder={'Select subcategory'}
                                                                options={subCatOptions}
                                                                onChange={(e) => {
                                                                    setAddProductData({
                                                                        ...addProductData,
                                                                        subCategoryId: e.value,
                                                                    });
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-700">{`Subcategory Id : ${addProductData.subCategoryId}`}</p>
                                                    )}
                                                </div>
                                                <div className="form-group mb-2">

                                                    <input
                                                        value={addProductData?.name}
                                                        type="text"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputName"
                                                        placeholder="Product Name"
                                                        name="name"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                name: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">

                                                    <input
                                                        value={addProductData?.batchNo}
                                                        type="text"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        placeholder="Batch"
                                                        name="batchNo"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                batchNo: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputUid" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Uid
                                                    </label>
                                                    <input
                                                        value={addProductData?.uid}
                                                        type="text"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputUid"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                uid: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputPrice" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Price
                                                    </label>

                                                    <NumericFormat
                                                        value={addProductData?.price}
                                                        thousandSeparator
                                                        placeholder="0"
                                                        allowLeadingZeros={false}
                                                        decimalScale={2}
                                                        allowNegative={false}
                                                        onValueChange={(values) => {

                                                            setAddProductData({
                                                                ...addProductData,
                                                                price: Number(parseInt(values.floatValue, 10).toString()),
                                                            });
                                                        }}
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="form-group mb-2 ">
                                                    <label htmlFor="inputPrice" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Discounted Price
                                                    </label>

                                                    <input
                                                        value={addProductData?.discountedPrice}
                                                        type="number"
                                                        min="0"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputPhone"
                                                        onChange={(e) => {
                                                            if (addProductData.price === 0) {
                                                                errorToast("Add price first")
                                                                return
                                                            }
                                                            if (Number(parseInt(e.target.value, 10).toString()) > addProductData.price * (100 / maxDiscount)) {
                                                                errorToast(`discount price should be less then ${addProductData.price * (100 / maxDiscount)}`)
                                                                return;
                                                            }

                                                            setAddProductData({
                                                                ...addProductData,
                                                                discountedPrice: Number(parseInt(e.target.value, 10).toString()),
                                                                discount: Number(parseInt(e.target.value, 10).toString()) * 100 / addProductData.price
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputDiscount" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Max Discount - {maxDiscount} %
                                                    </label>


                                                    <input
                                                        value={Number(addProductData?.discount)}
                                                        type="number"
                                                        min="0"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputDiscount"
                                                        style={{
                                                            '-webkit-appearance': 'none',
                                                            '-moz-appearance': 'textfield',
                                                        }}
                                                        onChange={(e) => {
                                                            const parsedValue = e.target.value === '' ? '' : String(Number(e.target.value));
                                                            const discount = parseInt(parsedValue, 10);

                                                            if (addProductData.price === 0) {
                                                                errorToast("Add price first")
                                                                return
                                                            }

                                                            if (discount > maxDiscount) {
                                                                errorToast(`Discount should be less than ${maxDiscount}`);
                                                                setAddProductData({
                                                                    ...addProductData,
                                                                    discount: addProductData.discount,
                                                                    discountedPrice: addProductData.discountedPrice
                                                                });
                                                                return;
                                                            }
                                                            const disPrice = discount * addProductData.price / 100
                                                            if (discount < 0 || isNaN(discount) || discount === undefined) {
                                                                setAddProductData({
                                                                    ...addProductData,
                                                                    discount: 0,
                                                                    discountedPrice: 0,
                                                                });
                                                            } else {
                                                                setAddProductData({
                                                                    ...addProductData,
                                                                    discount: discount,
                                                                    discountedPrice: disPrice,
                                                                });
                                                            }

                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputDescription" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={addProductData?.description}
                                                        rows="1"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputDescription"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                description: e.target.value,
                                                            });
                                                        }}
                                                    ></textarea>
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputBrand" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Brand
                                                    </label>
                                                    <input
                                                        value={addProductData?.brand}
                                                        type="text"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputBrand"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                brand: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputqty" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Qty  Stock
                                                    </label>

                                                    <NumericFormat
                                                        value={addProductData?.qty}
                                                        thousandSeparator
                                                        placeholder="0"
                                                        allowLeadingZeros={false}
                                                        decimalScale={0}
                                                        allowNegative={false}
                                                        onValueChange={(values) => {

                                                            setAddProductData({
                                                                ...addProductData,
                                                                qty: Number(values.floatValue),
                                                            });
                                                        }}
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />

                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputqty" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Hsn Code
                                                    </label>
                                                    <NumericFormat
                                                        value={addProductData?.hsn}
                                                        thousandSeparator
                                                        placeholder="Hsn Code"
                                                        allowLeadingZeros={false}
                                                        decimalScale={0}
                                                        allowNegative={false}
                                                        onValueChange={(values) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                hsn: Number(values.floatValue),
                                                            });
                                                        }}
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputDiscountType" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Discount Type
                                                    </label>
                                                    <Select
                                                        id="inputDiscountType"
                                                        value={{ value: addProductData.discountType, label: addProductData.discountType }}
                                                        options={[
                                                            { value: 'FIXED', label: 'FIXED' },
                                                            { value: 'PERCENTAGE', label: 'PERCENTAGE' },
                                                        ]}
                                                        defaultValue={{ value: 'FIXED', label: 'FIXED' }}
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                discountType: e.value,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputImages" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Images
                                                    </label>
                                                    {addProductData.type === 'update' ? (
                                                        <>
                                                            {updateImages?.map((x, i) => (
                                                                <div className="relative" key={i}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="absolute top-0 left-0 w-6 h-6"
                                                                        checked={updateImageIds.includes(x)}
                                                                        onChange={() => handleImageClick(x)}
                                                                    />
                                                                    <img
                                                                        key={i}
                                                                        className="w-24 h-24"
                                                                        src={`/products/${x}`}
                                                                        alt=""
                                                                        onClick={() => handleImageClick(x)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <input
                                                                type="file"
                                                                className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                id="inputImages"
                                                                multiple
                                                                onChange={(e) => {
                                                                    setUpdateImages({
                                                                        ...updateImages,
                                                                        image: e.target.files,
                                                                    });
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="file"
                                                            className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                            id="inputImages"
                                                            multiple
                                                            onChange={(e) => {
                                                                setAddProductData({
                                                                    ...addProductData,
                                                                    image: e.target.files,
                                                                });
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label htmlFor="inputVideo" className="block text-left text-sm font-medium text-gray-700 mb-1">
                                                        Video
                                                    </label>

                                                    <input
                                                        type="file"
                                                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        id="inputVideo"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                video: e.target.files[0],
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-5 sm:mt-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-300 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                                                    onClick={(e) => addOrUpdateProduct(e)}
                                                >
                                                    {isLoading ? 'Loading...' : addProductData.type === "add" ? "Add" : "Update"}
                                                </button>
                                            </div>
                                            <div className="mt-2 sm:mt-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-300 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                    onClick={() => {

                                                        setAddProductData({
                                                            name: "",
                                                            batchNo: "",
                                                            uid: "",
                                                            price: 0,
                                                            discountedPrice: 0,
                                                            discount: 0,
                                                            brand: "",
                                                            qty: 0,
                                                            description: "",
                                                            avgRating: 0,
                                                            numReviews: 0,
                                                            image: null,
                                                            video: null,
                                                            categoryId: "",
                                                            subCategoryId: "",
                                                            discountType: "",
                                                            han: 0,
                                                            type: "",
                                                        });
                                                        setModelToggle(false);
                                                        setDeleteId([]);
                                                        setUpdateImageIds([])
                                                        setProductId("")
                                                        setUpdateImages({})

                                                    }}

                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div
                className={`${deleteToggle ? "block" : "hidden"} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
            >
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Are you sure you want to delete this category?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={(e) => {
                                deleteProducts(e);
                            }}
                        >
                            {isLoading ? 'Loading...' : 'Delete'}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => {
                                setDeleteToggle(false);
                                setAddProductData({});
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div >

    );
}