"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Categories, SubCategory } from "../../../../types/global";
import { useAppSelector, useAppDispatch } from '../../../app/redux/hooks';
import { fetchCategories, setProducts } from "@/app/redux/slices/categorySlice";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select'

const Filter = React.memo(() => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories: Categories[] = useAppSelector((state): any => state?.categories?.categories);
  const productsList: any[] = useAppSelector((state): any => state?.categories?.productsList);

  const filteredOptions = useMemo(() => {
    const subCategories = categories.filter((item: any) => item?.name === params.sub).flatMap((category: any) => category.SubCategory);

    if (subCategories.length > 0) {
      let sub = []
      for (let x in subCategories) {
        if (subCategories[x].products.length > 0) {
          sub.push({ value: subCategories[x].id, label: subCategories[x].name })
        }
      }
      return sub;
    } else {
      return [];
    }
  }, [categories, params.sub]);

  const handleChange = (e: any) => {
    const product: any = productsList.filter((item: any) => item.subCategoryId === e.value);
    dispatch(setProducts(product));
  };

  useEffect(() => {
    const product: any = productsList.filter((item: any) => item.subCategoryId === filteredOptions[0]?.value);
    dispatch(setProducts(product));
  }, [filteredOptions]);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  return (
    <>
      {
        filteredOptions.length > 0 &&
        <div className="flex justify-between items-center border-b-2 ">
          <div className="flex justify-center items-center">
            <div className="flex justify-between w-[322px] border-r-2 py-[22px]">
              <div className="text-xl font-bold poppins uppercase pl-16">
                sub category :
              </div>
              <div className="flex justify-center items-center text-sm pr-6 font-light poppins uppercase">
                <Select options={filteredOptions} onChange={handleChange} />
                {/* CLEAR ALL */}
              </div>
            </div>
            <div className="flex gap-5 pl-5">
              <div className="bg-[#CFCFCF] py-2 px-6 rounded-full flex gap-3 ">
                <span>Price</span>
                <button>X</button>
              </div>
              <div className="bg-[#CFCFCF] py-2 px-6 rounded-full flex gap-3 ">
                <span>In Stock</span>
                <button>X</button>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-base roboto bg-[#F7F7F7] border-l-2 py-6 px-7">
            <div>
              <span className="font-normal pr-3">Sort by:</span>
              <span className="font-bold">Price, High To Low</span>
            </div>
            <img src="/image/downarrow.svg" alt="" />
          </div>
        </div>
      }
    </>
  );
});

export default Filter;
