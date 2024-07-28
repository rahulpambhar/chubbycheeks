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
    <div>
      {Topselectionitem?.length > 0 && (
        <div className="py-10">
          <div className="flex justify-center items-center uppercase font-normal text-5xl pt-10 unica-one">
            Recent Viewed
          </div>

          <div className={`pt-5 lg:mx-48 overflow-x-auto gap-1 flex justify-center items-center`}>
            {Topselectionitem.map((item: any) => {
              const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false;
              return (
                <div key={item.id} className="inline-block rounded-sm  w-80 mx-2">
                  <Recentviewedcard
                    item={item}
                    wish={wish}
                  />
                </div>
              );
            })}
          </div>
          <div className="hidden lg:flex justify-center items-center pt-10">
            <img src="/image/Slider.svg" alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recentviewed;
