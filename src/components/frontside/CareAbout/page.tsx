// import Image from "next/image";
import React from "react";

const Careabout = ({
  image,
  label,
  discription,
}: {
  image: string;
  label: string;
  discription: string;
}) => {
  return (
    <div className=" mx-5 my-2 bg-white py-5 px-10">
      <img src={image} alt={label} className="pt-5" />
      <p className="text-2xl font-normal pt-10 roboto">
        <label htmlFor="">{label}</label>
      </p>
      <p className="pt-5 text-base text-[#6D6D6D] roboto">{discription}</p>
    </div>
  );
};

export default Careabout;
