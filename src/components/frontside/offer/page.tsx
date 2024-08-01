import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const OfferPage = () => {
  const router = useRouter(); return (
    <div className="relative  lg:bg-none">
      <Image width={2000} height={1000}
        src="/image/chubbyCheeks/offer-4.jpeg"
        alt="offer"
        className=" bg-[#69C8E5] object-contain object-right lg:bg-none w-full h-[700px]"
      />
      <div className=" bg-[#69C8E5] sm:absolute md:top-4 md:left-10 lg:top-28 lg:left-28  md:bg-transparent py-5  px-5 ">
        <div className="text-2xl lg:text-5xl font-semibold">
          {" "}
          <p>20% OFF</p> MONSOON SALE
        </div>
        <div className=" md:pt-5 lg:pt-10 lg:text-xl font-normal">
          <p>Enjoy our Monsoon Sale! Get amazing discounts on all garments.</p>{" "}
          Shop now and save big!{" "}
        </div>
        <div className="pt-5 lg:pt-10 ">
          <button onClick={() => { router.push("/categories/clothes") }} className="w-44 h-14 bg-black text-white text-xl font-normal rounded-full ">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
