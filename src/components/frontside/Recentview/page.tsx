import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

const Recentviewedcard = ({
  image,
  label,
  discription,
  newbtn,
}: {
  image: string;
  label: string;
  discription: string;
  newbtn: boolean;
}) => {
  return (
    <>
      <div className="border-2 border-[#CFCFCF] shadow-xl mx-5 my-2 bg-white pb-5">
        <div>
          {newbtn ? (
            <div className="flex justify-between">
              <div className="font-semibold text-base px-7 flex justify-center items-center bg-black text-white">
                NEW
              </div>
              <div className="pr-5 pt-5">
                <FaRegHeart className="w-7 h-7" />
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="pr-5 pt-5">
                <FaRegHeart className="w-7 h-7" />
              </div>
            </div>
          )}
        </div>
        <div className="pt-5 flex justify-center items-center">
          {" "}
          <img src={image} alt={label} />
        </div>
        <p className="text-2xl font-normal pt-5">
          <label
            htmlFor=""
            className=" flex justify-center items-center gap-3 robto"
          >
            {label}
          </label>
        </p>
        <p className="pt-3 text-base  flex justify-center items-center gap-3 roboto">
          <FaStar />
          {discription}
        </p>
        <div className="flex justify-center items-center pt-5 px-5">
          <button className="bg-black text-white py-3 px-12 md:px-20 lg:px-24 roboto">
            ADD TO CART
          </button>
        </div>
      </div>
    </>
  );
};

export default Recentviewedcard;
