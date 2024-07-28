"use client";
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export default function Component() {

  return (
    <>
      <Carousel className="w-full h-[80vh] mt-3  md:mx-0 ">
        <CarouselContent>
          {
            items.map((item, index) => (
              <CarouselItem key={index}>
                {item}
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 rounded-full bg-[#000] p-2 text-[#fff] hover:bg-[#fff] hover:text-[#000] focus:outline-none focus:ring-1 focus:ring-ring" />
        <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 rounded-full bg-[#000] p-2 text-[#fff] hover:bg-[#fff] hover:text-[#000] focus:outline-none focus:ring-1 focus:ring-ring" />
      </Carousel>
    </>
  )
}




const items = [

  <div className="aspect-video overflow-hidden ">
    <video autoPlay loop muted className="w-full h-[80vh] object-cover">
      <source src="/image/chubbycheeks/video-4.mp4" />    </video>
  </div>,

  <img src="/image/chubbycheeks/image-11.png" alt="Carousel Image" width={1200} height={675} className="w-full h-[80vh] object-cover"
  />,

  <div className="aspect-video overflow-hidden ">
    <video autoPlay loop muted className="w-full h-[80vh] object-cover">
      <source src="/image/chubbycheeks/video-5.mp4" />    </video>
  </div>,

  <div className="aspect-video overflow-hidden ">
    <video autoPlay loop muted className="w-full h-[80vh] object-cover">
      <source src="/image/chubbycheeks/video-3.mp4" />    </video>
  </div>,
];




