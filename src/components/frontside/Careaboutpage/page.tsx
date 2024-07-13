"use client";

import React, { useEffect, useState } from "react";
import { motion, scroll, useScroll } from "framer-motion";
import Careabout from "../CareAbout/page";
const careAboutItems1 = [
  {
    id: 1,
    image: "/image/vector.png",
    label: "First Item",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    image: "/image/vector.png",
    label: "Second Item",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    image: "/image/vector.png",
    label: "Third Item",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

const About = () => {
  return (
    <div className="bg-[#eeeeee] pt-4 pb-10 ">
      <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
        Just like you we care about
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-10 lg:mx-20 ">
        {careAboutItems1.map((item) => (
          <Careabout
            key={item.id}
            image={item.image}
            label={item.label}
            discription={item.description}
          />
        ))}
      </div>
      <div className="hidden lg:flex justify-center items-center pt-10">
        <img src="/image/Slider.svg" alt="" />
      </div>
    </div>
  );
};

export default About;
