"use client";
import React from "react";
import { useSelector } from 'react-redux';
import Unitedfreecard from "../unitedfree/page";

const Unitedfree = () => {
  const productsList: any = useSelector((state: any) => state.categories?.productsList);

  const shuffleArray = (array: any) => {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const selectedProducts = shuffleArray([...productsList]).slice(0, 4);

  return (
    <div className="bg-[#e6e1e1] py-10">
      <div className="flex justify-center items-center uppercase text-5xl font-normal unica-one">
        shop united & fill free
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-10 lg:mx-44">
        {selectedProducts && selectedProducts.map((item: any) => (
          <Unitedfreecard
            key={item.id}
            id={item.id}
            image={item.image}
            label={item.name}
            price={item.price}
            averageRating={item.avgRating}
            discription={item.description}
          />
        ))}
      </div>
      <div className="hidden lg:flex justify-center items-center py-11">
        <img src="/image/Slider.svg" alt="" />
      </div>
    </div>
  );
};

export default Unitedfree;
