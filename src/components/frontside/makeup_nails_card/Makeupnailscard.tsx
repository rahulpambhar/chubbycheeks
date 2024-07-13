"use client";
import React, { use, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaHeart, FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { AnyARecord } from "dns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@material-tailwind/react";
import Cart from "@/components/Cart";
import ProductPreview from "@/components/ProductPreview";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { fetchCategories } from '@/app/redux/slices/categorySlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { useParams } from 'next/navigation'
import { Categories, SubCategory, Product } from "../../../../types/global";
import { errorToast, successToast } from "@/components/toster";
import { addToWishList } from "@/app/redux/slices/wishListSlice";

const Makeupnailscard = ({ item, wish }: { item: any; wish: boolean }) => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const { data: session, status }: any = useSession();
  const [openPreview, setOpenPreview] = useState(false);
  const [priview, sePriview] = useState<Product>({} as Product)

  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);

  const handelike = async () => {
    if (session) {
      dispatch(addToWishList({ productId: item.id, }));
    } else {
      dispatch(isLoginModel(true));
    }
  };

  const addToCartFunction = async (id: string) => {
    const payload = { productId: id, action: "add" }
    const data = await dispatch(actionTocartFunc(payload))
    if (data.payload.st) {
      successToast(data?.payload.msg)
    } else {
      errorToast(data.payload.msg)
    }
  }

  return (
    <>
      <div className="relative  w-[260px] mx-5 my-3 bg-white pb-5  hover:shadow-2xl">
        <div className="flex justify-end absolute top-2 right-0 pr-5 ">
          <button onClick={handelike}>

            {wish ? (
              <FaHeart className="w-7 h-7 text-red-500" />
            ) : (
              <FaRegHeart className="w-7 h-7 " />
            )}
          </button>
        </div>
        <div className=" flex justify-center items-center pt-5">

          <Carousel placeholder={""} className="rounded-xl">

            {/* {
              item?.image?.map((image: any, index: number) => (
                <img
                  key={index}
                  src={`/products/${image}`}
                  alt={item?.name}
                  className="h-full w-full object-cover"
                />
              ))
            } */}


            <img
              src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
              alt="image 1"
              className="h-full w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
              alt="image 2"
              className="h-full w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
              alt="image 3"
              className="h-full w-full object-cover"
            />
          </Carousel>

          {/* <img src={'/products/1704121261122_0_producthandShapring.jpg'} alt={item?.name} /> */}
        </div>
        <p className="text-lg poppins font-medium pt-5">
          <label htmlFor="" className=" flex justify-center items-center gap-3 robto" >
            {item?.name}
          </label>
        </p>
        <p className="text-sm  flex justify-center items-center gap-1 roboto">
          <FaStar className="w-3 h-3" />
          {item?.description}
        </p>
        <div className=" justify-center items-center pt-3  relative transition group mx-2">
          <button className=" py-3  border-black border poppins  text-base font-bold w-full">
            ₹{item.price}
          </button>
          {
            session && cart?.find((cartItem: any) => cartItem?.productId === item.id) ?
              <button
                className="py-3 absolute left-0 border-black border poppins  text-base font-bold opacity-0 group-hover:opacity-100  w-full bg-black text-white"
                onClick={() => {
                  session ? dispatch(setOpenCart(!openCart)) : ""
                }}
              >
                Open cart
              </button> :
              <button
                className="py-3 absolute left-0 border-black border poppins  text-base font-bold opacity-0 group-hover:opacity-100  w-full bg-black text-white"
                onClick={() => {
                  session ? addToCartFunction(item.id) : dispatch(isLoginModel(true));
                }}
              >
                Add to cart
              </button>
          }
          <Link href={`/preview/${item.id}`}
            className="border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black"
          // onClick={() => {
          //   sePriview(item)
          //   setOpenPreview(!openPreview)
          // }}
          >
            Preview
          </Link>
          <Link href={`/buy/${item.id}`}
            className="border rounded-full text-xs border-indigo-400 px-2 py-1 hover:border-amber-800 text-black"
          >
            Buy
          </Link>
        </div>
        <Cart />
        {/* <ProductPreview
          openPreview={openPreview}
          product={priview}
          setOpenPreview={setOpenPreview}
        /> */}
      </div>
    </>
  );
};

export default Makeupnailscard;
