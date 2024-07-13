import React from "react";

const Breadcrumb = () => {
  return (
    <div className="flex  justify-between items-center py-5 px-16 border-b-2">
      <div className="uppercase text-sm  poppins">
        <span>
          HOME &gt; mackup &gt; <span className="font-bold">nail</span>
        </span>
      </div>
      <div className="uppercase  text-sm font-normal popppins">
        Showing 1–8 of 14 results
      </div>
    </div>
  );
};

export default Breadcrumb;
