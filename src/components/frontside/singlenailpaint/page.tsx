import React from "react";

const Singlenailpaint = () => {
  return (
    <div>
      <div className="font-normal text-3xl uppercase flex justify-center items-center pt-16">
        why united and free is the effortless choice
      </div>
      <div className="relative pt-10 roboto">
        <div className="flex justify-center items-center">
          <img src="/image/singlenailpaint.svg" alt="" className="w-[15%]" />
        </div>
        <div className="absolute left-48 top-44 pt-10">
          <div>
            <p className="text-xl">Direct delivery to your door.</p>
            <span>Order your products from the comfort of your home</span>
          </div>
          <div className="">
            <img src="/image/leftside.svg" alt="" className="w-[95%]" />
          </div>
        </div>
        <div className="absolute left-48 top-72 pt-10">
          <div>
            <p className="text-xl">Direct delivery to your door.</p>
            <span>Order your products from the comfort of your home</span>
          </div>
          <div className="">
            <img src="/image/leftside.svg" alt="" className="w-[95%]" />
          </div>
        </div>
        <div className="absolute left-48 top-96 pt-10">
          <div>
            <p className="text-xl">Direct delivery to your door.</p>
            <span>Order your products from the comfort of your home</span>
          </div>
          <div className="">
            <img src="/image/leftside.svg" alt="" className="w-[95%]" />
          </div>
        </div>
        <div className="absolute right-44 top-52  text-right pt-10">
          <div className=" pr-7">
            <p className="text-xl">Direct delivery to your door.</p>
            <span>Order your products from the comfort of your home</span>
          </div>
          <div className="">
            <img src="/image/rightside.svg" alt="" className="w-[95%]" />
          </div>
        </div>
        <div className="absolute right-44 top-[360px] text-right pt-10">
          <div className="pr-7">
            <p className="text-xl">Direct delivery to your door.</p>
            <span>Order your products from the comfort of your home</span>
          </div>
          <div className="">
            <img src="/image/rightside.svg" alt="" className="w-[95%]" />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pt-10">
        <button className="  bg-black  text-white rounded-full px-10 py-5 roboto text-xl font-normal">
          BUY NOW
        </button>
      </div>
      <div className="flex items-center justify-center py-10">
        <img src="/image/slider.svg" alt="" />
      </div>
    </div>
  );
};

export default Singlenailpaint;
