import Image from "next/image";
import React from "react";
import { FaStar, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/components/toster";
import { addToWishList } from "@/app/redux/slices/wishListSlice";
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
const Topselection = ({
  id,
  image,
  label,
  discription,
  price,
  newbtn,
  wish
}: {
  id: string;
  image: string;
  label: string;
  price: number;
  discription: string;
  newbtn: boolean;
  wish: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { data: session, status }: any = useSession();
  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);


  const handelike = async () => {
    if (session) {
      dispatch(addToWishList({ productId: id, }));
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
    <div className="border-2 border-[#CFCFCF] shadow-xl mx-5 my-2 bg-white pb-5 w-72 h-96 flex flex-col justify-between">
      <div>
        {newbtn ? (
          <div className="flex justify-between">
            <div className="font-semibold text-base px-7 flex justify-center items-center bg-black text-white">
              NEW
            </div>
            <div className="pr-5 pt-5">
              <button onClick={handelike}>
                {wish ? (
                  <FaHeart className="w-7 h-7 text-red-500" />
                ) : (
                  <FaRegHeart className="w-7 h-7 " />
                )}
              </button>

            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <div className="pr-5 pt-5">
              <button onClick={handelike}>

                {wish ? (
                  <FaHeart className="w-7 h-7 text-red-500" />
                ) : (
                  <FaRegHeart className="w-7 h-7 " />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="pt-5 flex justify-center items-center flex-grow">
        <Image
          className="border border-black rounded object-cover"
          src={`/products/${image}`}
          alt={label}
          width={200}
          height={200}
        />
      </div>
      <div className="px-5">
        <p className="text-2xl font-normal pt-5 text-center">{label}</p>
        <p className="pt-3 text-base text-center flex justify-center items-center gap-3">
          <FaStar />
          <span className="truncate">{discription}</span>
        </p>
      </div>
      <div className=" justify-center items-center pt-3  relative transition group mx-2">
      <button className=" py-3  border-black border poppins  text-base font-bold w-full">
          ₹{price}
        </button>
        {
          session && cart?.find((cartItem: any) => cartItem?.productId === id) ?
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
                session ? addToCartFunction(id) : dispatch(isLoginModel(true));
              }}
            >
              Add to cart
            </button>
        }
        {/* <button className="bg-black text-white py-3 px-12 md:px-20 lg:px-24 roboto">
          ADD TO CART
        </button> */}
      </div>
    </div>
  );
};

export default Topselection;
