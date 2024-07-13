import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { TbStarFilled } from "react-icons/tb";
import { TbStar } from "react-icons/tb";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import { errorToast, successToast } from "@/components/toster";
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import Cart from "@/components/Cart";



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
  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
  console.log('openCart::: ', id);

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
    <div className="mx-5" key={id}>
      <div className="relative overflow-hidden">
        {" "}
        <img src={image} alt={label} className="h-[300px] " />
        <div className="absolute h-full w-full bg-black/20 flex justify-center items-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="flex flex-col gap-48 ">
            <div>
              <div className="flex text-white gap-3 justify-center items-center">

                {[...Array(5)].map((star, index) => (
                  <TbStarFilled
                    key={index}
                    className={`mr-1 ${index < averageRating ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-white font-normal text-2xl unica-one flex justify-center items-center">
                $ {price}
              </div>
            </div>
            {
              session && cart?.find((cartItem: any) => cartItem?.productId === id) ?

                <button className="roboto font-normal text-xl text-white border-b-2 flex justify-center items-center"
                  onClick={() => {
                    session ? dispatch(setOpenCart(!openCart)) : ""
                  }}>
                  {" "}
                  OPEN CART
                </button> :
                <button className="roboto font-normal text-xl text-white border-b-2 flex justify-center items-center"
                  onClick={() => {
                    session ? addToCartFunction(id) : dispatch(isLoginModel(true));
                  }}>
                  {" "}
                  ADD TO CART
                </button>
            }
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
