import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { isLoginModel } from "@/app/redux/slices/utilSlice";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import Loader from "react-js-loader";

const Howitwork = () => {
  return (
    <div>
      <div className="py-10 ">
        <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
          How it works
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2  lg:grid-cols-3 pt-10 lg:mx-20 ">
          <div className="py-10 px-16 bg-[#f4f2f2] mx-10">
            <label htmlFor="" className="unica-one font-normal text-5xl">
              01
            </label>
            <p className="roboto font-normal text-lg pt-5 text-[#6D6D6D]">
              Order online from the comfort of your home
            </p>
          </div>{" "}
          <div className="py-10 px-16 bg-[#f4f2f2] mx-10">
            <label htmlFor="" className="unica-one font-normal text-5xl">
              01
            </label>
            <p className="roboto font-normal text-lg pt-5 text-[#6D6D6D]">
              Order online from the comfort of your home
            </p>
          </div>{" "}
          <div className="py-10 px-16 bg-[#f4f2f2] mx-10">
            <label htmlFor="" className="unica-one font-normal text-5xl">
              01
            </label>
            <p className="roboto font-normal text-lg pt-5 text-[#6D6D6D]">
              Order online from the comfort of your home
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howitwork;

