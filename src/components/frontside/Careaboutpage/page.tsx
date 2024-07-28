"use client";

import React from "react";
import { motion, scroll, useScroll } from "framer-motion";
import Careabout from "../CareAbout/page";

const careAboutItems1 = [
  {
    id: 1,
    image: "/image/chubbyCheeks/JUSTLIKEYOU-1.avif",
    label: "Quality and Safety",
    description:
      "We know that safety is your top priority. That's why all our products go through rigorous testing to ensure they are safe and gentle for your little ones.",
  },
  {
    id: 2,
    image: "/image/chubbyCheeks/JUSTLIKEYOU-3.jpg",
    label: "Comfort and Style",
    description:
      "We believe that comfort shouldn't come at the expense of style. Our clothes are designed to keep your baby comfy while looking adorable.",
  },
  {
    id: 3,
    image: "/image/chubbyCheeks/JUSTLIKEYOU-4.jpeg",
    label: "Sustainability",
    description:
      "Caring for the planet is part of caring for our children. We use eco-friendly materials and sustainable practices to create products that are as kind to the earth as they are to your baby.",
  },
];

const About = () => {
  return (
    <div className="bg-[#eeeeee] pt-4 pb-10 ">
      <div className="flex justify-center items-center uppercase text-5xl pt-10 font-normal text-unica-one">
        Just like you, we care about
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-10 lg:mx-20  ">
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
        <img src="/image/Slider.svg" alt="Slider" />
      </div>
    </div>
  );
};

export default About;
