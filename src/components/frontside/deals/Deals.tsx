import React from "react";

const Deals = () => {
  return (
    <div>
      <div className="flex justify-center items-center unica-one font-bold text-6xl pt-20">
        Deals of the Day
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-14 px-20  gap-10 mx-auto ">
        <div className="relative flex justify-center items-center">
          <img src="/image/deals1.jpg" alt="" />
          <div className="glassmorph absolute  bottom-4  md:bottom-8 py-1 px-9 md:py-3  md:px-[75px] md:text-xl  lg:py-5 lg:px-28 lg:text-2xl font-medium poppins">
            Min 60% Off
          </div>
        </div>
        <div className=" relative flex justify-center items-center">
          <img src="/image/deals2.jpg" alt="" />{" "}
          <div className="glassmorph absolute bottom-4  md:bottom-8 py-1 px-5 md:py-3  md:px-14 md:text-xl  lg:py-5 lg:px-28 lg:text-2xl font-medium poppins">
            Buy 2 Get 1 Free
          </div>
        </div>
        <div className="relative  flex justify-center items-center">
          <img src="/image/deals3.jpg" alt="" />{" "}
          <div className="glassmorph absolute  bottom-4  md:bottom-8 py-1 px-9 md:py-3  md:px-[75px] md:text-xl  lg:py-5 lg:px-28 lg:text-2xl font-medium poppins">
            Min 40% Off
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;
