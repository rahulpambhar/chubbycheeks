import React from "react";
import Uppernav from "./upperpart/page";
import Lowernav from "./lowerpart/page";

const Navbar = () => {
  return (
    <div className=" drop-shadow shadow-lg">
      <Uppernav />
      <Lowernav />
    </div>
  );
};

export default Navbar;
