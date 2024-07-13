"use client";
import React from "react";
import MultiRangeSlider from "../progressbarr/progressbar";

const Sidebar = () => {
  return (
    <div className="md:grid  items-center pl-16 pt-3 w-[321px] hidden ">
      <div className="py-5">
        <div className="text-base font-bold poppins uppercase">Price</div>
        {/* <div className="pt-6">
          <img src="/image/filter.svg" alt="" />
        </div>
        <div className="flex justify-start pl-8 items-center pt-5 font-medium text-xs poppins">
          {" "}
          Rs.120.00 - Rs.5,680.00
        </div> */}
        <div className="pt-6">
          <MultiRangeSlider
            min={120}
            max={5680}
            onChange={({ min, max }) => { }}
          />
        </div>
      </div>
      <div className=" grid gap-5 py-5">
        <div className="text-base font-bold poppins uppercase">
          Availability
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <div className="flex  items-center gap-2">
              <input
                type="checkbox"
                className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
              />
              <span>In Stock</span>
            </div>
            <div className="pr-6">797</div>
          </div>{" "}
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
              />
              <span>Out Of Stock</span>
            </div>
            <div className="pr-6">15</div>
          </div>{" "}
        </div>
      </div>
      <div className="grid gap-5 py-5">
        <div className="text-base font-bold poppins uppercase">color</div>
        <div className="grid gap-3">
          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <div className="w-5 h-5 rounded-full bg-[#B41421]"></div>
            <span className="text-sm font-normal poppins pt-2 ">Reds</span>
          </div>
          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <div className="w-5 h-5 rounded-full bg-[#EF5DA8]"></div>
            <span className="text-sm font-normal poppins pt-2">Pinks</span>
          </div>
          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <div className="w-5 h-5 rounded-full bg-[#C38452]"></div>
            <span className="text-sm font-normal poppins pt-2">Browns</span>
          </div>
          <div className="flex  items-center gap-[10px]">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <div className="w-5 h-5 rounded-full bg-[#750D04]"></div>
            <span className="text-sm font-normal poppins pt-2">Maroons </span>
          </div>
          <div>
            <span className=" text-sm font-normal poppins uppercase text-[#00A991]">
              15 MORE...
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-5 py-5">
        <div className="text-base font-bold poppins uppercase">
          Availability
        </div>
        <div className="grid gap-2 py-5">
          <div className="flex items-center gap-2">
            <div className="">
              <input
                type="checkbox"
                className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
              />
            </div>
            <span className="text-sm font-normal poppins">10% and above</span>
          </div>

          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <span className="text-sm font-normal poppins">20% and above</span>
          </div>
          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <span className="text-sm font-normal poppins">30% and above</span>
          </div>
          <div className="flex  items-center gap-2">
            <input
              type="checkbox"
              className="size-6 appearance-none checked:border-4 checked:border-white border border-[#CFCFCF] outline-2 outline-black bg-white checked:bg-black checked:focus:outline"
            />
            <span className="text-sm font-normal poppins">60% and above</span>
          </div>
        </div>
      </div>
      <div className="grid gap-5 py-5">
        <div className="text-base font-bold poppins uppercase">
          Customer Ratings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
