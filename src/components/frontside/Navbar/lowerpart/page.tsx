"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/app/redux/slices/categorySlice';

const Lowernav = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: any) => state?.categories?.categories);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch]);
  return (
    <div className=" h-[60px] flex items-center justify-center md:justify-between md:px-[60px]">
      <div className=" flex pl-3 gap-5 md:gap-10 ">
        {categories?.map((ele: any) => (
          <button className="w-[80px] h-[30px] font-semibold md:h-[40px] md:w-[119px] uppercase md:font-bold hover:bg-black hover:text-white rounded-full"    >
            <Link href={`/catagory/${ele.name}`} className="">
              <p className="text-[var(--primary5)] text-center">
                {ele.name}
              </p>
            </Link>
          </button>
        ))}
      </div>
      <div className="relatives  hidden md:flex ">
        <Image
          src={"/image/offer.svg"}
          alt=""
          width={130}
          height={110}
          className=" "
        />
        <span className="absolute text-white md:top-[95px] md:right-24 font-bold uppercase">
          OFFERS
        </span>
      </div>
    </div>
  );
};

export default Lowernav;
