import React from "react";

const OfferPage = () => {
  return (
    <div className="relative  lg:bg-none">
      <img
        src="/image/offer.jpg"
        alt="offer"
        className="w-full bg-[#69C8E5] lg:bg-none"
      />
      <div className=" bg-[#69C8E5] sm:absolute md:top-4 md:left-10 lg:top-28 lg:left-28  md:bg-transparent py-5  px-5 ">
        <div className="text-2xl lg:text-5xl font-semibold">
          {" "}
          <p>20% OFF</p> WINTER SALE
        </div>
        <div className=" md:pt-5 lg:pt-10 lg:text-xl font-normal">
          <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>{" "}
          Sodales placerat libero, egestas tristique imperdiet.{" "}
        </div>
        <div className="pt-5 lg:pt-10 ">
          <button className="w-44 h-14 bg-black text-white text-xl font-normal rounded-full ">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
