"use client";
import React, { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const items = [
  <div className="item">
    <video controls autoPlay loop muted className="w-[1500px] h-[650px] ">
      <source src="/image/chubbycheeks/video-4.mp4" />
      Your browser does not support the video tag.
    </video>
  </div>,
  <div className="item">
    <video height="100%" controls autoPlay loop muted className="w-[1500px] h-[650px]">
      <source src="/image/chubbycheeks/video-3.mp4" />
      Your browser does not support the video tag.
    </video>

  </div>,
  <div className="item">
    <video controls autoPlay loop muted className="w-[1500px] h-[650px] ">
      <source src="/image/chubbycheeks/video-5.mp4" />
      Your browser does not support the video tag.
    </video>
  </div>,

];

const ImageSlider = () => {
  const [mainIndex, setMainIndex] = useState(0);

  const slideNext = () => {
    if (mainIndex < items.length - 1) {
      setMainIndex(mainIndex + 1);
    }
  };

  const slidePrev = () => {
    if (mainIndex > 0) {
      setMainIndex(mainIndex - 1);
    }
  };

  return (
    <>
      <div className="flex justify-center w-[1500px] container mt-5 items-center " >
        <div className="">
          <Carousel className=" ">
            <CarouselContent>
              {
                items.map((item, index) => (
                  <CarouselItem key={index}>
                    {item}
                  </CarouselItem>
                ))
              }

            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

        </div>

      </div>


    </>
    // <div className="carousel mt-1 ">


    //   {/* <AliceCarousel
    //     activeIndex={mainIndex}
    //     disableDotsControls
    //     disableButtonsControls
    //     items={items}
    //   /> */}
    //   <p className="index">{`${mainIndex + 1}/${items.length}`}</p>
    //   <div className="caption-container">
    //     <p className="caption">
    //       Description...
    //     </p>
    //   </div>

    //   <div className="btn-prev" onClick={slidePrev}>
    //     &lang;
    //   </div>
    //   <div className="btn-next" onClick={slideNext}>
    //     &rang;
    //   </div>
    // </div>
  );
};

export default ImageSlider;


// const images = [
//   "/image/eyeliner.png",
//   "/image/fab-matte.png",
//   "/image/glam.png",
//   "/image/liquid-lipstick.png",
// ];

// const ImageSlider: React.FC = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 7000); // Change image every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const changeImage = (index: number) => {
//     setCurrentImageIndex(index);
//   };

//   return (
//     <div className="relative bg-black h-[70vh]">
//       {images.map((image, index) => (
//         <img
//           key={index}
//           src={image}
//           alt={`Image ${index + 1}`}
//           className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
//             currentImageIndex === index ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       ))}
//       <div className="absolute -bottom-7 left-0 right-0 flex justify-center gap-2">
//         {images.map((_, index) => (
//           <span
//             key={index}
//             onClick={() => changeImage(index)}
//             className={`h-2 w-2 rounded-full bg-gray-500 mx-1 cursor-pointer ${
//               currentImageIndex === index ? "!bg-black" : ""
//             }`}
//           ></span>
//         ))}
//       </div>
//     </div>
//   );
// };

