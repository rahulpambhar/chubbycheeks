"use client";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from '../../../../app/redux/hooks';
import { fetchCart } from '../../../../app/redux/slices/cartSclice';
import { baseUrl } from "../../../../../env";
import Link from "next/link";
import { toast } from "react-hot-toast"
import { isLoginModel, setOpenCart } from '../../../../app/redux/slices/utilSlice'
import { signOut } from "next-auth/react";
import { fetchWhishList } from "@/app/redux/slices/wishListSlice";

const Uppernav = () => {
  const { data: session }: any = useSession();
  const isLoginModelOpen = useAppSelector((state) => state.utilReducer.isLoginModelOpen);
  const cart = useAppSelector((state) => state.cartReducer.cart);
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session) {
      dispatch(fetchCart());
      dispatch(fetchWhishList());
    }
  }, [session, dispatch]);
  return (
    <div className="h-20 bg-black flex items-center justify-between lg:px-10 md:px-5 px-2">
      <div>
        <Image src="/image/HatchfulExport-All/pinterest_board_photo.png" alt="Logo" width={150} height={150} />
      </div>
      <div className="flex items-center md:gap-5 lg:gap-18">
        <div className="lg:w-[650px] md:w-[300px] h-10 bg-white hidden md:flex items-center rounded-md lg:pl-5">
          Everyone loves!
        </div>
        <div className=" flex gap-3 lg:gap-5 items-center">
          {session && (
            <>
              <Link href="/profile?wish=1">
                <Image src="/image/heart.svg" alt="Heart Icon" width={28} height={28} />
              </Link>
              <Link href="/profile">
                <Image src="/image/UserCircle.svg" alt="User Icon" width={28} height={28} />
              </Link>
            </>
          )}
          <span className="relative">

            <Image
              src="/image/ShoppingCartSimple.svg"
              alt="Shopping Cart Icon"
              width={28}
              height={28}
              onClick={() => { dispatch(setOpenCart(!openCart)) }}
              className="cursor-pointer"
            />
            {cart && cart.CartItem?.length > 0 && (
              <div className="absolute -top-2 left-5 bg-white rounded-full px-2 text-xs">
                {cart.CartItem.length}
              </div>
            )}
          </span>
          <div className="text-white">
            {session ? (
              <>
                <span className="fontFamily">{session.user.name}</span>
                {session.user.isAdmin ? (
                  <div className="fontFamily cursor-pointer" onClick={() => signOut({ callbackUrl: baseUrl })}>
                    Logout
                  </div>
                ) : (
                  <>
                    <Link href="/order">
                      <span className="fontFamily cursor-pointer">Orders</span>
                    </Link>
                    <div className="fontFamily cursor-pointer" onClick={() => signOut({ redirect: false })}>
                      Logout
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => dispatch(isLoginModel(!isLoginModelOpen))}
                className="fontFamily text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    // <div className="h-[80px]  bg-black flex flex-grow items-center justify-between lg:px-10 md:px-5 px-2 ">
    //   <div className="">
    //     <Image src={"/image/logo.svg"} alt="" width={150} height={150} />
    //   </div>
    //   <div className="flex items-center md:gap-5 lg:gap-10 ">

    //     <div className="lg:w-[650px] md:w-[300px] h-[40px] bg-white hidden  rounded-md justify-center lg:pl-5 items-center md:flex invisible md:visible lg:visible">
    //       {" "}
    //       Everyone loves!
    //     </div>

    //     <div className=" relative flex gap-3 lg:gap-5">
    //       {
    //         session ?
    //           <>
    //             <Link href="/profile?wish=1">
    //               <Image src={"/image/heart.svg"} alt="" width={28} height={100} />
    //             </Link>
    //             <Link href="/profile">
    //               <Image src={"/image/UserCircle.svg"} alt="" width={28} height={100} />
    //             </Link>
    //           </>
    //           : ""
    //       }

    //       <Image src={"/image/ShoppingCartSimple.svg"} alt="" width={28} height={50} onClick={() => { dispatch(setOpenCart(!openCart)) }} />

    //       <div className="absolute -top-2 right-9  bg-white rounded-full px-2">
    //         {cart && cart?.CartItem?.length}
    //       </div>

    //       <div className="text-light">
    //         {session ? (
    //           <>
    //             <span className="fontFamily">
    //               {session.user.name}
    //             </span>
    //             {
    //               session?.user?.isAdmin ?
    //                 <div className="fontFamily text-white" onClick={() => signOut({ callbackUrl: baseUrl })}>
    //                   Logout
    //                 </div> :
    //                 <>
    //                   <div className="fontFamily" >
    //                     <Link href="/order">
    //                       <span className="text-white">orders</span>
    //                     </Link>
    //                   </div>
    //                   <div className="fontFamily text-white" onClick={() => signOut({ redirect: false, })}>
    //                     Logout
    //                   </div>
    //                 </>
    //             }
    //           </>
    //         ) : (
    //           <button onClick={() => dispatch(isLoginModel(!isLoginModelOpen))} className="fontFamily text-white">
    //             Login
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Uppernav;
