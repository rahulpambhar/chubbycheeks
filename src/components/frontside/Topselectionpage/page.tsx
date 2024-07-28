"use client";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { useAppSelector } from "../../../app/redux/hooks";
import TopselectionCard from "../TopselectionCard/page";

// Dummy wishlist actions
const toggleWishlistItem = (item: any) => ({
  type: 'TOGGLE_WISHLIST_ITEM',
  payload: item,
});

export default function Component() {
  const Topselectionitem: any = useSelector((state: any) => state.categories.productsList);
  const [showAll, setShowAll] = useState(false);
  const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);

  const handleSeeAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <section className="container mx-auto py-12 font-sans mt-[100px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-grow flex justify-center items-center uppercase font-normal text-5xl pt-10 unica-one">
            Top selection
          </div>
          <div className="flex justify-end mx-6 md:mx-8 lg:mx-12 items-center pt-5 md:pt-5 z-10 relative">
            <button className="text-lg font-medium" onClick={handleSeeAll}>
              {showAll ? 'SHOW LESS' : 'SEE ALL'}
            </button>
          </div>
        </div>
        <div className={`gap-4 ${showAll ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-h-screen overflow-y-auto' : 'flex overflow-x-auto'} mt-10`}>
          {Topselectionitem?.length > 0 && Topselectionitem.map((item: any, index: number) => {
            const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false;

            return (
              <div key={index} className={`p-2 ${showAll ? '' : 'inline-block w-96'}`}>
                {item && <TopselectionCard item={item} wish={wish} />}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
