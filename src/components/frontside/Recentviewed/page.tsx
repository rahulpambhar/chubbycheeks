import React from "react";
import Recentviewedcard from "../Recentview/page";

const Topselectionitem = [
  {
    id: 1,
    newbtn: true,
    image: "/image/nailpaint.svg",
    label: "Product External",
    description: "4.4  (57,164)",
  },
  {
    id: 2,
    newbtn: false,
    image: "/image/nailpaint.svg",
    label: "Second Item",
    description: "4.4  (57,164)",
  },
  {
    id: 3,
    newbtn: false,
    image: "/image/nailpaint.svg",
    label: "Third Item",
    description: "4.4  (57,164)",
  },
];

const Recentviewed = () => {
  return (
    <div>
      <div className=" py-10 ">
        <div className="flex justify-center items-center uppercase font-normal text-5xl pt-10 unica-one">
          Recent viewed
        </div>
        {/* <div className="flex justify-end mx-6 md:mx-8 lg:mx-12 items-center pt-5 md:pt-5">
          <button className="text-lg font-medium">SEE ALL</button>
        </div> */}
        <div className=" grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-5 lg:mx-48 justify-center items-center">
          {Topselectionitem.map((item) => (
            <Recentviewedcard
              key={item.id}
              newbtn={item.newbtn}
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
    </div>
  );
};

export default Recentviewed;
