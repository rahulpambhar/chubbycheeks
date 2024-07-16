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
import { FaStar } from 'react-icons/fa6';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import { getUser } from '@/app/redux/slices/userSlice';
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import Cart from "@/components/Cart";
import { addToWishList } from "@/app/redux/slices/wishListSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { profileInitials, profileValidate, countryCodes } from "@/app/utils";


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
    const getProfile = async () => await dispatch(getUser(session?.user?.id))

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders: any[] = component === "Orders" ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : component === "Wishlist" ? wishlist?.slice(indexOfFirstOrder, indexOfLastOrder) : component === "ReturnOrders" ? returnOrder?.slice(indexOfFirstOrder, indexOfLastOrder) : [];
    const productsList: any = useSelector((state: any) => state.categories.productsList);
    const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
    const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
    const userProfile = useAppSelector((state) => state?.userReducer?.user);

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

    const addToCartFunction = async (id: string) => {
        const payload = { productId: id, action: "add" }
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

    const FileInput = ({ field, form }: any) => {
        const handleChange = (event: any) => {
            const file = event.currentTarget.files[0];
            form.setFieldValue(field.name, file);
        };

        return <input type="file" onChange={handleChange} />;
    };

    useEffect(() => {
        session && getOrders()
        session && getReturnOrders()
        session && getProfile();
    }, [session])

    useEffect(() => {
        session && component === "Orders" ? setLength(orders.length) : component === "Wishlist" ? setLength(wishlist.length) : component === "ReturnOrders" ? setLength(returnOrder.length) : setLength(0)
    }, [session, orders, wishlist, returnOrder, component])

    useEffect(() => {
        session && search === "1" ? setComponent("Wishlist") : ""
    }, [session, search])

    const [initialValues, setInitialValues] = useState(profileInitials);
    // console.log('initialValues::: ', initialValues);


    useEffect(() => {

        setInitialValues(prevState => ({
            ...prevState,
            ...profileInitials,
          }));


      
        //   console.log('userProfile::: ', userProfile);
    }, [userProfile])

    return (
        <>
            <div className="container border-t border-grey-dark">
                <div className="flex flex-col justify-between pt-10 pb-16 sm:pt-12 sm:pb-20 lg:flex-row lg:pb-24">
                    <div className="lg:w-1/4">
                        <div className="flex flex-col pl-3">
                            <button onClick={(e) => setComponent("Account")} className='transition-all hover:font-bold hover:text-primary px-4 py-3 border-l-2 border-primary-lighter hover:border-primary  font-hk text-grey-darkest '>
                                Account
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
                        component === "Account" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-10 px-6 sm:px-10">
                                <h1 className="font-hkbold mb-12 text-2xl text-secondary sm:text-left">
                                    Account Details
                                </h1>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={profileValidate}
                                    onSubmit={(values, { setSubmitting }) => {
                                        console.log('values::: ', values);

                                    }}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, }) => (
                                        <>
                                            <Form className="p-6 bg-white rounded-lg shadow-md space-y-6">
                                                <div className="flex items-center space-x-4 mb-6">
                                                    <Image
                                                        src={`/users/${userProfile?.profile_pic}`}
                                                        height={160}
                                                        width={100}
                                                        alt="user image"
                                                        className="h-40 w-40 overflow-hidden rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <label htmlFor="file" className="block font-medium text-gray-700">
                                                            Upload file
                                                        </label>
                                                        <Field name="file" component={FileInput} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="mb-4">
                                                        <label htmlFor="name" className="block font-medium text-gray-700">
                                                            Name
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            className="form-input mt-1 block w-full"
                                                            placeholder="John Doe"
                                                        />
                                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="email" className="block font-medium text-gray-700">
                                                            Email Address
                                                        </label>
                                                        <Field
                                                            type="email"
                                                            name="email"
                                                            className="form-input mt-1 block w-full"
                                                            placeholder="john@example.com"
                                                        />
                                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div className="mb-4">
                                                        <label htmlFor="country_code" className="block font-medium text-gray-700">
                                                            Select  Country Code
                                                        </label>
                                                        <Field as="select" name="country_code" onChange={(e: any) => {
                                                            const country = countryCodes.find((country: any) => country.value === e.target.value);
                                                            country && setFieldValue("country", country.label);
                                                            setFieldValue("country_code", e.target.value);
                                                        }} className="form-input mt-1 block w-full">
                                                            <option value="" disabled hidden>Select Country Code</option>
                                                            {countryCodes.map(country => (
                                                                <option key={country.value} value={country.value}>{country.label} ({country.value})</option>
                                                            ))}
                                                        </Field>

                                                        <ErrorMessage name="country_code" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="mobile" className="block font-medium text-gray-700">
                                                            Mobile
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            name="mobile"
                                                            className="form-input mt-1 block w-full"
                                                            placeholder="1234567890"
                                                        />
                                                        <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="gender" className="block font-medium text-gray-700">
                                                            Gender
                                                        </label>
                                                        <Field as="select" name="gender" className="form-input mt-1 block w-full" >
                                                            <option value="" disabled hidden>Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </Field>
                                                        {/* <Field
                                                            type="text"
                                                            name="gender"
                                                            className="form-input mt-1 block w-full"
                                                            placeholder="Male/Female"
                                                        /> */}
                                                        <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <h4 className="font-semibold mb-4 text-xl text-gray-800">Billing Address</h4>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                                        <div className="mb-4">
                                                            <label htmlFor="street" className="block font-medium text-gray-700">
                                                                Address
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name="address"
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="123 Main St"
                                                            />
                                                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                                        </div>

                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <div className="mb-4">
                                                            <label htmlFor="city" className="block font-medium text-gray-700">
                                                                City
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name="city"
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="New York"
                                                            />
                                                            <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="state" className="block font-medium text-gray-700">
                                                                State
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name="state"
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="NY"
                                                            />
                                                            <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="zip" className="block font-medium text-gray-700">
                                                                Zip Code
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name="pincode"
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="10001"
                                                            />
                                                            <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label htmlFor="country" className="block font-medium text-gray-700">
                                                            Country
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name="country"
                                                            className="form-select mt-1 block w-full"
                                                        >
                                                            <option value="">Select Country</option>
                                                            <option value="us">United States</option>
                                                            {/* Add more country options here */}
                                                        </Field>
                                                        <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                                                    </div>
                                                </div>

                                                <div className="mt-6">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </Form>
                                        </>
                                    )}
                                </Formik>

                            </div>
                        </div>
                    }
                    {
                        component === "Wishlist" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1 className="font-hkbold pb-6 text-center text-2xl text-secondary sm:text-left">
                                    My Wishes
                                </h1>
                                {filterWishes && filterWishes.map((item: any) => (
                                    <div className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4">

                                        <div className="flex flex-col w-full border-b border-grey-dark pb-4  border-black text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">

                                            <Image width={100} height={100} src={`/products/${item?.product?.image[0]}`} alt='No image found' className="mt-2 font-hk text-base   text-secondary" />
                                            <div>
                                                <h6 className="font-hk text-secondary">{item?.product?.name}</h6>
                                                {/* <h6 className="font-hk text-secondary">{item?.product?.avgRating}</h6>  */}
                                                <div className="flex items-center mb-1">
                                                    {[...Array(5)].map((star, index) => (
                                                        <FaStar
                                                            key={index}
                                                            className={`mr-1 ${index < item?.product?.avgRating ? "text-yellow-500" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <h6 className="font-hk text-secondary">Review : {item?.product?.numReviews ? item?.product?.numReviews : 0}</h6>
                                            </div>
                                        </div>

                                        <div className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                            <h6 className="font-hk text-secondary">{item?.product?.price} $</h6>
                                            <h6 className="font-hk text-secondary">{item?.product?.discountType === "PERCENTAGE" ? `${item?.product?.discount}% Off` : `${item?.product?.discount} $ off`}</h6>
                                            <h6 className="font-hk text-secondary">  {
                                                item?.product?.discountType === "PERCENTAGE" ? (item?.product?.price * 1 - ((item?.product?.price * 1) * item?.product?.discount / 100)) : ((item?.product?.price - item?.product?.discount) * 1)
                                            } $</h6>
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
                                                            session ? addToCartFunction(item?.product?.id) : dispatch(isLoginModel(true));
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

                                    </div>
                                ))}
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
                                {currentOrders.map((item: any, index: number) => (
                                    <Link href={`/checkout/estimation/?orderID=${item.id}`}>
                                        <div
                                            key={index}
                                            className="mb-3 flex flex-col items-center justify-between rounded bg-white px-4 py-5 shadow sm:flex-row sm:py-4 transition duration-300 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div
                                                className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                                <span className="mt-2 font-hk text-base text-secondary">{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                            </div>
                                            <div
                                                className="flex w-full flex-col border-b border-grey-dark pb-4 text-center sm:w-1/3 sm:border-b-0 sm:pb-0 sm:text-left md:w-2/5 md:flex-row md:items-center">
                                                <span className="mt-2 font-hk text-base text-secondary">{item.id}</span>
                                            </div>
                                            <div
                                                className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/5 sm:border-b-0 sm:pb-0">
                                                <span className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Quantity</span>
                                                <span className="font-hk text-secondary">{item.itemCount}</span>
                                            </div>
                                            <div
                                                className="w-full border-b border-grey-dark pb-4 text-center sm:w-1/6 sm:border-b-0 sm:pr-6 sm:pb-0 sm:text-right xl:w-1/5 xl:pr-16">
                                                <span className="font-hkbold block pt-3 pb-2 text-center text-sm uppercase text-secondary sm:hidden">Price</span>
                                                <span className="font-hk text-secondary">${item.total}</span>
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
                        component === "ReturnOrders" &&
                        <div className="mt-12 lg:mt-0 lg:w-3/4">
                            <div className="bg-grey-light py-8 px-5 md:px-8">
                                <h1 className="font-hkbold pb-6 text-center text-2xl text-secondary sm:text-left">
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
                <Cart />
            </div>
        </>
    )
}

