import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

const Topselection = ({
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
    <div className="border-2 border-[#CFCFCF] shadow-xl mx-5 my-2 bg-white pb-5 w-72 h-96 flex flex-col justify-between">
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
      <div className="flex justify-center items-center pt-5">
        <button className="bg-black text-white py-3 px-12 md:px-20 lg:px-24 roboto">
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default Topselection;
