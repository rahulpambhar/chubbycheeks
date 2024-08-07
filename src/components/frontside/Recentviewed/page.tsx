import React, { useEffect, useState } from "react";
import Recentviewedcard from "../Recentview/page";
import { useSelector } from 'react-redux';
import { useAppSelector } from "@/app/redux/hooks";

const Recentviewed = () => {
  const [Topselectionitem, setTopselectionitem] = React.useState([]);
  const productsList: any = useSelector((state: any) => state.categories.productsList);
  const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);

  useEffect(() => {
    const getrecentView: any = localStorage.getItem("recentVw");
    const filterProducts = productsList?.filter((item: any) => getrecentView?.includes(item.id));
    setTopselectionitem(filterProducts);
  }, [productsList]);



  return (
    <section className="container mx-auto font-sans mt-[100px]">
      <div className="flex items-center justify-between mb-6">
        {/* <div className="flex-grow flex justify-center items-center uppercase font-normal text-5xl pt-10 unica-one">
          Recent Viewed
        </div> */}
        <div className="flex-grow flex justify-center items-center mb-4">
            <div className="w-full flex justify-center lg:justify-center lg:w-auto mb-6 lg:mb-0 ">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-black">Recent Viewed</h1>
            </div>
          </div>
      </div>
      <div className={`gap-4 flex overflow-x-auto mt-10`}>
        {Topselectionitem?.length > 0 && Topselectionitem.map((item: any, index: number) => {
          const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false;

          return (
            <div key={index} className={`p-2 inline-block w-96`}>
              {item && <Recentviewedcard item={item} wish={wish} />}
            </div>
          );
        })}
      </div>
    </section>

  );
};

export default Recentviewed;
