"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export default function Component() {

  return (
    <>
      <Carousel >
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
  <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-10 before:z-10">
    <img src="/image/chubbyCheeks/cover-1.jpg" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />

    <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[750px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
      <h2 className=" sm:text-4xl text-2xl  font-bold mb-6"><span className="text-black">Dress Up </span> <span > Little Dreams</span></h2>
      <p className="sm:text-lg text-base text-center text-gray-200"><span className="text-black">Turning little dreams into fashionable realities, </span> one outfit at a time, for cherished childhood memories.!</p>
    </div>
  </div>,

  <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-10 before:z-10">
    <img src="/image/chubbyCheeks/cover-2.jpg" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover object-bottom" />

    <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[750px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
      <h2 className=" sm:text-4xl text-2xl  font-bold mb-6"><span className="text-black">Creating magical moments, </span> <span > </span></h2>
      <p className="sm:text-lg text-base text-center text-gray-200"> Where tiny dreams meet trendy designs, Inspiring little dreamers every single day.</p>
    </div>
  </div>,

  <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-10 before:z-10">
    <img src="/image/chubbyCheeks/cover-3.jpg" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />

    <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[750px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
      <h2 className=" sm:text-4xl text-2xl  font-bold mb-6"><span className="text-black">Turning little dreams</span> <span > into  <span className="text-black">fashionable realities</span></span></h2>
    </div>
  </div>
]



