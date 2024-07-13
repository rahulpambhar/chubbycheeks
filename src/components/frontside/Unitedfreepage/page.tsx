"use client";
import React, { useEffect, useState } from "react";
import { motion, scroll, useScroll } from "framer-motion";
import Unitedfreecard from "../unitedfree/page";
const careAboutItems1 = [
  {
    id: 1,
    image: "/image/unitedfree.jpg",
    label: "Absolut",
    description: "Face and Body Lotion",
  },
  {
    id: 2,
    image: "/image/unitedfree.jpg",
    label: "Absolut",
    description: "Face and Body Lotion",
  },
  {
    id: 3,
    image: "/image/unitedfree.jpg",
    label: "Absolut",
    description: "Face and Body Lotion",
  },
];

const Unitedfree = () => {
  return (
    <div className="bg-[#e6e1e1]">
      <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
        shop united & free
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-10  lg:mx-44 gap-5 ">
        {careAboutItems1.map((item) => (
          <Unitedfreecard
            key={item.id}
            image={item.image}
            label={item.label}
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
