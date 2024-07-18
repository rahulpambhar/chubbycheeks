"use client";
import React, { useEffect, useState } from "react";
import { motion, scroll, useScroll } from "framer-motion";
import Unitedfreecard from "../unitedfree/page";
import { useSelector } from 'react-redux';





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
    <div className="bg-[#e6e1e1]">
      <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
        shop united & fill free
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-10  lg:mx-44 gap-5 ">
        {selectedProducts && selectedProducts.map((item: any) => (
          <Unitedfreecard
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
