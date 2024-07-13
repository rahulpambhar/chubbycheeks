"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchCategories } from "../../redux/slices/categorySlice";


import Makeupnailscard from "@/components/frontside/makeup_nails_card/Makeupnailscard";
import { FaS } from "react-icons/fa6";

const Page = () => {
  const dispatch = useAppDispatch();
  const products: any[] = useAppSelector(
    (state): any => state?.categories?.products
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(24);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentpage = products.slice(firstPostIndex, lastPostIndex);
  const nopage = Math.ceil(products.length / postPerPage);
  const numbers = Array.from({ length: nopage }, (_, index) => index + 1);
  const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const prepage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextpage = () => {
    if (currentPage !== nopage) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <div className=" pt-5  border-l-2 h-auto">
        <div className=" grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 pt-5  justify-center items-center">
          {products.length > 0
            ? currentpage.map((item, index) => {
              let wish: boolean = wishList?.find((wish) => (wish?.productId === item.id)) ? true : false
              return <Makeupnailscard key={index} item={item} wish={wish} />;
            })
            : ""}
        </div>
        <div className="flex mt-10 justify-center items-center border-t-2">
          <button>
            {" "}
            <span
              className="text-lg font-bold roboto uppercase bg-[#ece7e7] w-[320px] py-6 flex justify-center items-center"
              onClick={() => prepage()}
            >
              Previous
            </span>
          </button>
          <div className="flex flex-grow gap-5 justify-center items-center text-lg font-bold poppins">
            {numbers?.map((num) => {
              const isCurrentPage = currentPage === num;
              const isWithinRange =
                num >= currentPage - 1 && num <= currentPage + 1;

              if (
                isWithinRange ||
                isCurrentPage ||
                num === 1 ||
                num === nopage
              ) {
                return (
                  <div
                    key={num}
                    onClick={() => paginate(num)}
                    className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-black hover:text-white ${isCurrentPage ? "bg-black  text-white" : ""
                      }`}
                  >
                    {num}
                  </div>
                );
              }
              return null;
            })}
          </div>
          <button>
            <span
              className="text-lg font-bold roboto uppercase bg-[#ece7e7] w-[320px] py-6 flex justify-center items-center"
              onClick={() => nextpage()}
            >
              Next
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
