import React from "react";

const NailsliderCard = ({
  image1,
  image2,
  label,
  discription,
}: {
  image1: string;
  image2: string;
  label: string;
  discription: string;
}) => {
  return (
    <div className="relative py-16 ">
      <div className=" flex justify-center items-center">
        <img
          src={image2}
          alt={label}
          className="absolute -top-2 w-60 left-[550px] bg-[#f4f2f2] px-16 py-8 rounded-tr-[100px] rounded-bl-[100px] border-[10px]  border-white"
        />
      </div>
      <div className="grid grid-cols-2 justify-center ">
        <div className="grid place-items-center pl-10">
          <img src={image1} alt={label} className=" w-[500px]" />
        </div>
        <div className="pt-10 flex flex-col item-center place-items-start pr-10">
          <div className=" max-w-[450px] flex item-center place-items-center pl-20">
            <label
              htmlFor=""
              className="font-normal text-5xl unica-one flex item-center  "
            >
              {label}
            </label>
          </div>
          <div className="pt-20">
            {" "}
            <p className=" border-2 border-[#e7e2e2] rounded-lg roboto text-lg font-normal py-10 px-10">
              {discription}
            </p>
          </div>
          <div className="flex justify-center items-center pt-10 pl-14">
            <img src="/image/nailslider.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NailsliderCard;
