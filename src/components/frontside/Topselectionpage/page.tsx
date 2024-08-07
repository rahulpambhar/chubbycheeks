"use client";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useAppSelector } from "../../../app/redux/hooks";
import TopselectionCard from "../TopselectionCard/page";


export default function Component() {
  const Topselectionitem: any = useSelector((state: any) => state.categories.productsList);
  const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);



  return (
    <>
      <section className="text-gray-400 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex-grow flex justify-center items-center mb-20 ">
            <div className="w-full flex justify-center lg:justify-center lg:w-auto mb-6 lg:mb-0 ">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-black">Top selection</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center h-[800px] overflow-y-auto">  {/* Set fixed height */}
            {Topselectionitem?.length > 0 && Topselectionitem.map((item: any, index: number) => {
              const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false;
              return (
                <div key={index} className="p-2">
                  {item && <TopselectionCard item={item} wish={wish} />}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
