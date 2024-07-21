"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/app/redux/slices/categorySlice';
import { Button } from "@/components/ui/button"


const Lowernav = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: any) => state?.categories?.categories);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch]);
  return (
    <header className="w-full  bg-background py-3 h-[70px] ">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 ml-10  ">
          <nav className="flex items-center gap-4">
            {categories?.map((ele: any) => (
              <Button key={categories?.id}
                variant="outline"
                className="rounded-full  transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Link href={`/categories/${ele.name}`} className="">
                  <p className="text-[var(--primary5)] text-center">
                    {ele.name}
                  </p>
                </Link>
              </Button>
            ))}


          </nav>
        </div>
        <div className="relatives hidden md:flex  ">
          <Image
            src={"/image/offer.svg"}
            alt=""
            width={130}
            height={60}
            className=""
          />
          <span className="absolute text-white ml-5 mt-1 font-bold uppercase">
            OFFERS
          </span>
        </div>
     
      </div>
    </header>
 
  );
};

export default Lowernav;
