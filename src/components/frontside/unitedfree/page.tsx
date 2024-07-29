import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { TbStarFilled } from "react-icons/tb";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import { errorToast, successToast } from "@/components/toster";
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import Cart from "@/components/Cart";
import { StarRating } from "@/components/frontside/TopselectionCard/page"

const Unitedfreecard = ({
  id,
  image,
  label,
  price,
  averageRating,
  discription,
}: {
  id: string;
  image: string;
  label: string;
  price: number;
  averageRating: number;
  discription: string;
}) => {
  const dispatch = useAppDispatch();
  const { data: session, status }: any = useSession();
  const cart = useAppSelector((state: any) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state: any) => state?.utilReducer?.openCart);
  const [productSize, setSize] = useState("NONE");

  const addToCartFunction = async (id: string, productSize: string) => {
    const payload = { productId: id, action: "add", productSize };
    const data = await dispatch(actionTocartFunc(payload));
    if (data.payload.st) {
      successToast(data?.payload.msg);
    } else {
      errorToast(data.payload.msg);
    }
  };

  return (
    <div className="mx-5" key={id}>
      <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
        <Image
          src={`/products/${image}`}
          alt={label}
          className="w-full h-64 object-cover"
          width={300}
          height={300}
        />
        <div className="absolute inset-0 bg-black/20 flex justify-center items-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="flex flex-col gap-12">
            <div className="flex text-white gap-3 justify-center items-center">
              <StarRating rating={averageRating || 5} />


            </div>
            <div className="text-white font-normal text-2xl unica-one flex justify-center items-center">
              ₹ {price}
            </div>
            {session && cart?.find((cartItem: any) => cartItem?.productId === id) ? (
              <button
                className="roboto font-normal text-xl text-white border-b-2 flex justify-center items-center"
                onClick={() => {
                  session ? dispatch(setOpenCart(!openCart)) : "";
                }}
              >
                OPEN CART
              </button>
            ) : (
              <button
                className="roboto font-normal text-xl text-white border-b-2 flex justify-center items-center"
                onClick={() => {
                  session ? addToCartFunction(id, productSize) : dispatch(isLoginModel(true));
                }}
              >
                ADD TO CART
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-2xl font-normal pt-5 roboto">
        <label htmlFor="">{label}</label>
      </p>
      <p className="pt-1 text-base text-[#6D6D6D] roboto">{discription}</p>
      <Cart />
    </div>
  );
};

export default Unitedfreecard;
