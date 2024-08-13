"use client";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useAppSelector } from "../../../app/redux/hooks";
import TopselectionCard from "../TopselectionCard/page";
import { Card, Skeleton } from "@nextui-org/react";


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
          <div className="flex flex-wrap items-center justify-center h-[950px] overflow-y-auto">  {/* Set fixed height */}
            {Topselectionitem?.length > 0 ? Topselectionitem.map((item: any, index: number) => {
              const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false;
              return (
                <div key={index} className="p-2">
                  {item && <TopselectionCard item={item} wish={wish} />}
                </div>
              );
            }) :
              <>
                {
                  [...Array(6)].map((_, index) => (
                    <div key={index} className="p-2">
                      <Card className="w-[200px] space-y-5 p-4" radius="lg">
                        <Skeleton className="rounded-lg">
                          <div className="h-24 rounded-lg bg-default-300"></div>
                        </Skeleton>
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                          </Skeleton>
                        </div>
                      </Card>
                    </div>
                  ))
                }
              </>}
          </div>
        </div>
      </section>
    </>
  );
}
