"use client";
import { Fragment, use, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import Link from 'next/link';
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
import { BsHeartbreak } from "react-icons/bs";
import { addDays, format } from "date-fns"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import { StarRating } from '@/components/frontside/TopselectionCard/page';
import MyOrders from '@/components/frontside/MyOrders/page';
import MyReturnOrders from '@/components/frontside/MyReturnOrders/page';
import { useRouter, } from 'next/navigation'

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
    const router = useRouter()
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
    const getReturnOrders = async () => await dispatch(getReturnOrdersFunc({ page: currentPage, limit: ordersPerPage, search: "", from: date?.from?.toString(), to: date?.to?.toString(), slug: "getAll", }))
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

        !session && router.push("/¡")
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



    return (
        <>
            <div className="container main-content border-t border-grey-dark  ">
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
                                    My Profile
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
                                <h1 className="font-hk bold pb-6 text-center text-2xl  sm:text-left">
                                    My Wishes
                                </h1>
                                {filterWishes && filterWishes.map((item: any) => {
                                    const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.productId)) ? true : false

                                    return (
                                        <Card className="shadow-xl border rounded-3 mt-5 mb-3">
                                            <CardContent>
                                                <div className="flex flex-wrap">
                                                    <div className="w-full lg:w-1/4 p-4">
                                                        <Link href={`/preview/${item?.product?.id}`} className="">
                                                            <Image src={`/products/${item?.product?.image[0]}`} alt='No image found' width={150} height={150} className="rounded-xl  w-[150px] h-[170px] object-cover object-center hover:shadow-lg transition-shadow duration-300 ease-in-out" />
                                                        </Link>
                                                    </div>
                                                    <div className="w-full lg:w-2/4 p-4  ">
                                                        <div className='flex justify-between'>
                                                            <h5>{item?.product.name}</h5>
                                                            <BsHeartbreak onClick={() => handelike(item?.product?.id)} className="w-7 h-7 text-red-500" />
                                                        </div>


                                                        <div className="flex items-center text-red-500 mb-2">
                                                            <StarRating rating={item?.product?.avgRating || 5} />
                                                        </div>

                                                        <p className="text-gray-600 text-sm">
                                                            {item?.product.description}
                                                        </p>
                                                        <div className="flex items-center mt-1 ">
                                                            <h6 className="font-hk "> ₹ {
                                                                item?.product?.discountType === "PERCENTAGE" ? (item?.product?.price * 1 - ((item?.product?.price * 1) * item?.product?.discount / 100)) : ((item?.product?.price - item?.product?.discount) * 1)
                                                            } </h6>
                                                            <h4 className="ml-2 text-red-500 line-through ">₹ {item?.product?.price} </h4>

                                                            <span className="text-xl ml-2 font-semibold mr-2 text-green-600">{item?.product?.discountType === "PERCENTAGE" ? `${item?.product?.discount}% Off` : `${item?.product?.discount} ₹ off`}</span>

                                                            <p className="border-l-black border-l-2 pl-2  text-green-600">Free shipping</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 my-2">
                                                            <p className='text-tiny'>Available size</p>
                                                            <ToggleGroup type="single" variant="outline"
                                                            >
                                                                {
                                                                    item?.product?.size?.map((item: any) => (
                                                                        <ToggleGroupItem key={item} value={item} className="w-auto h-6 "
                                                                        >
                                                                            <p className="text-tiny">  {item}</p>
                                                                        </ToggleGroupItem>
                                                                    ))
                                                                }
                                                            </ToggleGroup>
                                                        </div>
                                                    </div>
                                                    <div className="w-full lg:w-1/4 p-4 border-t lg:border-t-0 lg:border-l">

                                                        <div className="flex flex-col mt-4">
                                                            <Button className="mt-2">
                                                                <Link href={`/preview/${item?.product?.id}`} className="">
                                                                    Preview
                                                                </Link>
                                                            </Button>
                                                            {session && cart?.find((cartItem: any) => cartItem?.productId === item?.product?.id) ?
                                                                <Button variant="outline" className="mt-2 border border-green-800" onClick={() => {
                                                                    dispatch(setOpenCart(!openCart))
                                                                }}>
                                                                    Open cart
                                                                </Button>

                                                                :
                                                                <Button variant="outline" className="mt-2 border border-green-800" onClick={() => {
                                                                    session ? addToCartFunction(item?.product?.id, productSize) : dispatch(isLoginModel(true));
                                                                }}>
                                                                    Add to cart
                                                                </Button>
                                                            }

                                                            <Button variant="outline" className="mt-2  border border-green-500">
                                                                <Link href={`/buy/${item?.product?.id}`} className="" >
                                                                    Buy
                                                                </Link>
                                                            </Button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                                {filterWishes?.length > 0 ? <div className="flex justify-center pt-6 md:justify-end">
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
                                </div> : <h1 className='  text-bold text-center mt-10'>No Wishes Found</h1> 
                                }
                            </div>
                        </div>
                    }
                    {
                        component === "Orders" &&
                        <MyOrders currentOrders={currentOrders} getOrders={getOrders} ordersPerPage={ordersPerPage} handlePageChange={handlePageChange} pegiLenght={pegiLenght} currentPage={currentPage} />
                    }
                    {
                        component === "ReturnOrders" &&
                        <MyReturnOrders currentOrders={currentOrders} getOrders={getOrders} ordersPerPage={ordersPerPage} handlePageChange={handlePageChange} pegiLenght={pegiLenght} currentPage={currentPage} />
                    }
                </div>
            </div>
            <Cart />
        </>
    )
}

