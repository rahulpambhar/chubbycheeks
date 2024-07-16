import React, { useState } from "react";
import Topselection from "../Topselection/page";
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from "../../../app/redux/hooks";




const Topselectionpart = () => {
  const Topselectionitem: any = useSelector((state: any) => state.categories.productsList);
  const [showAll, setShowAll] = useState(false);
  const wishList: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);


  const handleSeeAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="py-10">
        <div className="flex justify-center items-center uppercase font-normal text-5xl pt-10 unica-one">
          Top selection
        </div>
        <div className="flex justify-end mx-6 md:mx-8 lg:mx-12 items-center pt-5 md:pt-5">
          <button className="text-lg font-medium" onClick={handleSeeAll}>
            {showAll ? 'SHOW LESS' : 'SEE ALL'}
          </button>
        </div>
        <div className={`pt-5 lg:mx-48 ${showAll ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'overflow-x-auto whitespace-nowrap'}`}>
          {Topselectionitem.map((item: any) => {
            const wish: boolean = wishList?.find((wish) => (wish?.productId === item?.id)) ? true : false
            return item?.topSelected &&
              <div key={item.id} className={`inline-block ${showAll ? 'w-full' : 'w-80'}`}>
                <Topselection
                  id={item.id}
                  wish={wish}
                  price={item?.price}
                  newbtn={item.isNew}
                  image={item.image}
                  label={item.label}
                  discription={item.description}
                />
              </div>
          })}
        </div>
        <div className="hidden lg:flex justify-center items-center pt-10">
          <img src="/image/Slider.svg" alt="" />
        </div>
      </div>
    </div>

  );
};

export default Topselectionpart;
