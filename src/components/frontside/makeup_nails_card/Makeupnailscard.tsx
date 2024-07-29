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

  const { data: session, status }: any = useSession();
  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
  const [productSize, setSize] = useState([]);

  const handelike = async () => {
    if (session) {
      dispatch(addToWishList({ productId: item.id, }));
    } else {
      dispatch(isLoginModel(true));
    }
  };

  const addToCartFunction = async (id: string, productSize: string[]) => {
    const payload = { productId: id, action: "add", productSize }
    const data = await dispatch(actionTocartFunc(payload))
    if (data.payload.st) {
      successToast(data?.payload.msg)
    } else {
      errorToast(data.payload.msg)
    }
  }

  return (
    <>
      code commented
      {/* <div className="relative  w-[260px] mx-5 my-3 bg-white pb-5  hover:shadow-2xl shadow">
        <div className="flex justify-end absolute top-2 right-0 pr-5 ">
          <button onClick={handelike}>

            {wish ? (
              <FaHeart className="w-7 h-7 text-red-500" />
            ) : (
              <FaRegHeart className="w-7 h-7 " />
            )}
          </button>
        </div>

        <div className=" flex justify-center items-center pt-10 ">
          <Carousel placeholder={""} className=" px-1 rounded-xl">

            {
              item?.image?.map((image: any, index: number) => (
                <Image
                  height={100}
                  width={100}
                  key={index}
                  src={`/products/${image}`}
                  alt={item?.name}
                  className="h-[300px] w-[300px] ml-8 object-cover "
                />
              ))
            }
          </Carousel>
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
                  session ? addToCartFunction(item.id,productSize) : dispatch(isLoginModel(true));
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
      
      </div> */}
    </>
  );
};

export default Makeupnailscard;
