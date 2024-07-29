"use client";
import { Fragment, use, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import Link from 'next/link';
import moment from "moment"
import { getReturnOrdersFunc } from '@/app/redux/slices/returnOrderSlice';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import { getUser } from '@/app/redux/slices/userSlice';
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import Cart from "@/components/Cart";
import { addToWishList } from "@/app/redux/slices/wishListSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { profileUpdateInitials, profileUpdateValidate, countryCodes } from "@/app/utils";
import ProfilePic from "../../../components/frontside/profile/profilePic";
import TopSection from '@/components/frontside/profile/topSection';
import MobileCode from '@/components/frontside/profile/mobileCode';
import AddressSection from '@/components/frontside/profile/addressSection';
import ChangePassword from '@/components/frontside/profile/changePassword';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { FaStar, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { addDays, format } from "date-fns"
import { getStatusClass } from "@/app/admin/orders/maintainOrders/page";
import Dropdown from '@/components/frontside/Dropdown/page'
import { FaCopy } from 'react-icons/fa';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function Checkout() {
    const { data: session, status }: any = useSession();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const search = searchParams.get('wish')
    const searchOrders = searchParams.get('orders')
    const orders: any[] = useAppSelector((state) => state?.orderReducer?.orders);
    const wishlist: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);
    const returnOrder: any[] = useAppSelector((state) => state?.returnOrderReducer.returnOrders);
    const [productSize, setSize] = useState("NONE");

    const [component, setComponent] = useState("Profile");
    const [pegiLenght, setLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5

    const [date, setDate] = useState({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
        // from: oneYearAgo,
        // to: today,
    })

    const getOrders = async () => await dispatch(getOrdersFunc({ page: currentPage, limit: ordersPerPage, search: "", from: date?.from?.toString(), to: date?.to?.toString(), slug: "getAll" }))
    const getReturnOrders = async () => await dispatch(getReturnOrdersFunc())
    const getProfile = async () => await dispatch(getUser(session?.user?.id))

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders: any[] = component === "Orders" ? orders?.slice(indexOfFirstOrder, indexOfLastOrder) : component === "Wishlist" ? wishlist?.slice(indexOfFirstOrder, indexOfLastOrder) : component === "ReturnOrders" ? returnOrder?.slice(indexOfFirstOrder, indexOfLastOrder) : [];
    const productsList: any = useSelector((state: any) => state.categories.productsList);
    const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
    const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
    const userProfile = useAppSelector((state: any) => state?.userReducer?.user);
    const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const filterWishes = useMemo(() => {
        return productsList?.map((item: any) => {
            const wish = currentOrders?.find((wish) => wish?.productId === item?.id);
            if (wish) {
                return { ...wish, product: item };
            }
            return null;
        }).filter((item: any) => item !== null);
    }, [currentOrders, productsList]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const addToCartFunction = async (id: string, productSize: string) => {
        const payload = { productId: id, action: "add", productSize }
        const data = await dispatch(actionTocartFunc(payload))
        if (data.payload.st) {
            successToast(data?.payload.msg)
        } else {
            errorToast(data.payload.msg)
        }
    }

    const handelike = async (id: string) => {
        if (session) {
            dispatch(addToWishList({ productId: id, }));
        } else {
            dispatch(isLoginModel(true));
        }
    };

    useEffect(() => {
        session && getOrders()
        session && getReturnOrders()
        session && getProfile();
    }, [session])

    useEffect(() => {
        session && component === "Orders" ? setLength(orders?.length) : component === "Wishlist" ? setLength(wishlist.length) : component === "ReturnOrders" ? setLength(returnOrder.length) : setLength(0)
    }, [session, orders, wishlist, returnOrder, component])

    useEffect(() => {
        session && search === "1" ? setComponent("Wishlist") : ""
        session && searchOrders === "1" ? setComponent("Orders") : ""
    }, [session, search])

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            successToast('Address copied to clipboard');
        }).catch((err) => {
            errorToast('Failed to copy address');
        });
    };

    return (
        <>
            <div className="container border-t border-grey-dark">
                <div className="flex flex-col justify-between pt-10 pb-16 sm:pt-12 sm:pb-20 lg:flex-row lg:pb-24">
                    <div className="lg:w-1/4">
                        <div className="flex flex-col pl-3">
                            <button onClick={(e) => setComponent("Profile")} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk text-grey-darkest '>
                                Profile
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("Wishlist") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk text-grey-darkest '>
                                Wishlist
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("Orders") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk  text-grey-darkest '>
                                Orders
                            </button>
                            <button onClick={(e) => { setCurrentPage(1); setComponent("ReturnOrders") }} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk  text-grey-darkest'>
                                ReturnOrders
                            </button>
                        </div>
                    </div>
                    {
                        component === "Profile" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4 shadow-2xl" >
                            <div className="bg-grey-light py-10 px-6 sm:px-10">
                                <h1 className="font-hkbold mb-12 text-2xl  sm:text-left">
                                    Profile Details
                                </h1>

                                <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
                                    <ProfilePic />

                                    <Formik
                                        initialValues={profileUpdateInitials}
                                        validationSchema={profileUpdateValidate}
                                        onSubmit={async (values,) => {
                                            const formData = new FormData();
                                            formData.append("name", values?.name);
                                            formData.append("email", values?.email);
                                            formData.append("gender", values?.gender);

                                            formData.append("country_code", values?.country_code);
                                            formData.append("mobile", values?.mobile);

                                            formData.append("address", values?.address);
                                            formData.append("city", values?.city);
                                            formData.append("state", values?.state);
                                            formData.append("country", values?.country);
                                            formData.append("pincode", values?.pincode);

                                            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug/signup`, formData);

                                            if (res?.data?.st) {
                                                successToast(res?.data?.msg)
                                                getProfile();
                                            } else {
                                                errorToast(res?.data?.msg)
                                            }

                                        }}
                                    >
                                        {({ setFieldValue, isSubmitting }) => (
                                            <>
                                                <Form  >
                                                    <TopSection />
                                                    <MobileCode />
                                                    <AddressSection />
                                                </Form>
                                            </>
                                        )}
                                    </Formik>

                                    <ChangePassword />
                                </div>
                            </div>
                        </div>
                    }
                    {
                        component === "Wishlist" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1 className="font-hkbold pb-6 text-center text-2xl  sm:text-left">
                                    My Wishes
                                </h1>
                                {filterWishes && filterWishes.map((item: any) => {
                                    const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.productId)) ? true : false

                                    return (
                                        <div className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">

                                            <div className="flex flex-col w-full border-b border-grey-dark pb-4  text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center border">

                                                <Image width={100} height={100} src={`/products/${item?.product?.image[0]}`} alt='No image found' className="mt-2 font-hk text-base  border border-black " />
                                                <div className='border ml-2 '>
                                                    <p className="font-bold ">{item?.product?.name}</p>
                                                    <p className="text-sm">{item?.product?.description}</p>
                                                    {/* <h6 className="font-hk ">{item?.product?.avgRating}</h6>  */}
                                                    <div className="flex items-center mb-1">
                                                        {[...Array(5)].map((star, index) => (
                                                            <FaStar
                                                                key={index}
                                                                className={`mr-1 ${index < item?.product?.avgRating ? "text-yellow-500" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <h6 className="text-sm ">Review : {item?.product?.numReviews ? item?.product?.numReviews : 0}</h6>
                                                </div>
                                            </div>

                                            <div className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                                <h6 className="font-hk ">{item?.product?.price} ₹</h6>
                                                <h6 className="font-hk ">{item?.product?.discountType === "PERCENTAGE" ? `${item?.product?.discount}% Off` : `${item?.product?.discount} ₹ off`}</h6>
                                                <h6 className="font-hk ">  {
                                                    item?.product?.discountType === "PERCENTAGE" ? (item?.product?.price * 1 - ((item?.product?.price * 1) * item?.product?.discount / 100)) : ((item?.product?.price - item?.product?.discount) * 1)
                                                } ₹</h6>
                                            </div>

                                            <Link href={`/preview/${item?.product?.id}`} className="border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black">
                                                Preview
                                            </Link>
                                            <Link href={`/buy/${item?.product?.id}`} className="border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black" >
                                                Buy
                                            </Link>
                                            <div className="">
                                                {
                                                    session && cart?.find((cartItem: any) => cartItem?.productId === item?.product?.id) ?
                                                        <button className='border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black'
                                                            onClick={() => {
                                                                session ? dispatch(setOpenCart(!openCart)) : ""
                                                            }}
                                                        >
                                                            Open cart
                                                        </button> :
                                                        <button className='border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black'
                                                            onClick={() => {
                                                                session ? addToCartFunction(item?.product?.id, productSize) : dispatch(isLoginModel(true));
                                                            }}
                                                        >
                                                            Add to cart
                                                        </button>
                                                }
                                            </div>

                                            <button className='border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black'
                                                onClick={() => {
                                                    handelike(item?.product?.id)
                                                }}
                                            >
                                                Remove from cart
                                            </button>
                                            <div className="pr-5 pt-5">
                                                <button onClick={() => handelike(item?.product?.id)}>
                                                    {wish ? (
                                                        <FaHeart className="w-7 h-7 text-red-500" />
                                                    ) : (
                                                        <FaRegHeart className="w-7 h-7 " />
                                                    )}
                                                </button>

                                            </div>
                                        </div>
                                    )
                                })}
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
                    }
                    {
                        component === "Orders" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1
                                    className="font-hkbold pb-6 text-center text-2xl  sm:text-left text text-black">
                                    My Order's
                                </h1>
                                <div className="hidden sm:block">
                                    <div className="flex justify-between pb-3">

                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase ">Order Id</span>
                                        </div>

                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase ">Order Date  </span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase ">Expected Date </span>
                                        </div>

                                        <div className="w-1/3 pl-4 md:w-2/5">

                                            <span className="font-hkbold text-sm uppercase ">Items</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">

                                            <span className="font-hkbold text-sm uppercase ">Order value</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">

                                            <span className="font-hkbold text-sm uppercase ">PAYMENT</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">

                                            <span className="font-hkbold pr-8 text-sm uppercase  md:pr-16 xl:pr-8">Status</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">

                                            <span className="font-hkbold pr-8 text-sm uppercase  md:pr-16 xl:pr-8">Action</span>
                                        </div>
                                    </div>
                                </div>
                                {currentOrders && currentOrders?.map((item: any, index: number) => (
                                    <div key={index} className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4 transition duration-300 hover:bg-gray-100 cursor-pointer" >
                                        <div className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                            <h6 className="mt-2 font-hk text-base">{`${item?.id?.slice(0, 3)}...${item?.id.slice(-4)}`}</h6>

                                            <FaCopy
                                                className="ml-2 cursor-pointer text-blue-500"
                                                onClick={() => handleCopy(item.id)}
                                                title="Copy to clipboard"
                                            />
                                        </div>
                                        <div className=" w-full  border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                            <h6 className="mt-2 font-hk text-base ">{moment(item.createdAt).format('YYYY-MM-DD')}</h6>
                                            <h6 className="text-base ">{item?.createdAt ? moment(item?.createdAt).format('HH:mm:ss') : ""}</h6>
                                        </div>
                                        <div className=" w-full  border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                            <h6 className="mt-2 font-hk text-base ">{item?.expectedDate ? moment(item?.expectedDate).format('YYYY-MM-DD') : "-"}</h6>
                                        </div>

                                        <div className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                            <span className="font-hk ">{item.itemCount}</span>
                                        </div>
                                        <div className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                            <span className="font-hk ">₹{item.netAmount}</span>
                                        </div>
                                        <div className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                            <span className="font-hk ">{item.paymentMethod}</span>
                                        </div>
                                        <div className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                            <span className={`font-normal ${getStatusClass(item?.orderStatus)} rounded px-2 py-1`}>{item?.orderStatus}</span>
                                        </div>
                                        <div className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                            <Dropdown item={item} getOrders={getOrders} />
                                        </div>
                                    </div>
                                ))}

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
                    }
                    {
                        component === "ReturnOrders" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1 className="font-hkbold pb-6 text-center text-2xl  sm:text-left">
                                    Return Orders
                                </h1>
                                <div className="hidden sm:block">
                                    <div className="flex justify-between pb-3">
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase ">Order Date & Time (In)</span>
                                        </div>
                                        <div className="w-1/3 pl-4 md:w-2/5">
                                            <span className="font-hkbold text-sm uppercase ">Invoice No</span>
                                        </div>
                                        <div className="w-1/4 text-center xl:w-1/5">
                                            <span className="font-hkbold text-sm uppercase ">Items</span>
                                        </div>
                                        <div className="mr-3 w-1/6 text-center md:w-1/5">
                                            <span className="font-hkbold text-sm uppercase ">Return Order value</span>
                                        </div>
                                        <div className="w-3/10 text-center md:w-1/5">
                                            <span className="font-hkbold pr-8 text-sm uppercase  md:pr-16 xl:pr-8">Status</span>
                                        </div>
                                    </div>
                                </div>

                                {currentOrders && currentOrders?.map((order: any) => (<div
                                    className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">
                                    <div
                                        className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                        <span className="mt-2 font-hk text-base ">{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                    </div>
                                    <div
                                        className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                        <span className="mt-2 font-hk text-base ">{order?.invoiceNo}</span>
                                    </div>
                                    <div
                                        className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                        <span className="font-hk ">{order?.itemCount}</span>
                                    </div>
                                    <div
                                        className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                        <span className="font-hk ">₹{order?.netAmount}</span>
                                    </div>
                                    <div
                                        className="w-full text-center sm:w-3/10 sm:text-right md:w-1/4 xl:w-1/5">
                                        <div className="pt-3 sm:pt-0">
                                            <span className="font-hk ">{order?.orderRerunrnStatus}</span>
                                        </div>
                                    </div>
                                </div>))
                                }
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
                    }
                </div>
                <Cart />
            </div>
        </>
    )
}

