"use client";
import Image from "next/image";
import { GoDotFill, GoHomeFill } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";
import { HiCalculator } from "react-icons/hi";
import { BiCategory, BiSolidBank } from "react-icons/bi";
import { AiOutlineDropbox } from "react-icons/ai";
import { MdClose, MdRemove } from "react-icons/md";
import React, { useContext, useState } from "react";
import { TbDiscount2 } from "react-icons/tb";
import { MdOutlineMan } from "react-icons/md";
// import { GlobalContext } from "@/globel/GlobalContext";
import Link from "next/link";
import { IoIosRemove } from "react-icons/io";
import { PiDotOutlineFill } from "react-icons/pi";

const sidebarSubMenu = [{ name: "category" }, { name: "subCategory" }, { name: "products" },{ name: "top-selection" }];

function SidebarMenu({
  name,
  icon,
  text,
  pathname,
  handleMenu,
}: {
  name: string;
  icon: React.ReactNode;
  text?: string;
  pathname: string;
  handleMenu?: () => void;
}) {
  const [btn, srtBtn] = useState();
  //   const { btn } = useContext(GlobalContext);
  return (
    <button
      className={` ${pathname === `/${name}` ? "text-[--orange] " : "text-[--text-color]"
        } flex  hover:text-[--orange]  items-center  ${btn ? "justify-center" : "px-4 justify-start w-full gap-[15px]"
        } py-3`}
      onClick={handleMenu}
    >
      <div>{icon}</div>
      <span className=" flex justify-center items-center aleo font-bold text-medium">
        {text}
      </span>
    </button>
  );
}

const Admin_Sidebar = ({ closeSidebar }: any) => {
  const router = useRouter();

  //   const { btn } = useContext(GlobalContext);
  const pathname = usePathname();
  const [sidebarOption, setsidebarOption] = useState("");
  const [btn, srtBtn] = useState();

  return (
    <div className="w-60 bg-green-200 h-full">
      {btn ? (
        <>
          {/* logo */}
          <div className="flex justify-center items-center h-[80px] pt-[30px]">
            <Image
              src="/image/small_logo.svg"
              alt=""
              className=" mb-12 "
              width={60}
              height={50}
            />
          </div>

          {/* menu */}
          <div className="flex flex-col gap-[10px] justify-center pt-[15px]">
            <SidebarMenu
              name=""
              icon={
                <GoHomeFill className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="master"
              icon={
                <HiCalculator className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="tradingaccount"
              icon={
                <BiSolidBank className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="category"
              icon={
                <BiCategory className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="stocksetup"
              icon={
                <AiOutlineDropbox className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="sellersetup"
              icon={
                <TbDiscount2 className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
            <SidebarMenu
              name="customer"
              icon={
                <MdOutlineMan className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
            />
          </div>
        </>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center mb-4">

            <button className="lg:hidden float-end" onClick={closeSidebar}>
              <MdClose className="w-[30px] h-[30px]" />
            </button>
          </div>

          {/* menu */}
          <div className="flex flex-col  ">
            <Link href="/">
              {" "}
              <SidebarMenu
                name=""
                icon={
                  <GoHomeFill className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
                }
                pathname={pathname}
                text="Dashboard"
                handleMenu={() => setsidebarOption("dashboard")}
              />
            </Link>

            <SidebarMenu
              name="master"
              icon={
                <HiCalculator className="w-[27px] h-[27px] flex items-center justify-center" />
              }
              pathname={pathname}
              text="Master"
              handleMenu={() => setsidebarOption("admin/master")}
            />
            {(sidebarOption === "admin/master" ||
              pathname === "admin/master/category" ||
              pathname === "admin/master/products" ||
              pathname === "admin/master/subCategory") && (
                <div className=" grid gap-2 justify-center pl-[25px]">

                  {
                    sidebarSubMenu?.map((item, index) =>
                      <Link key={index} href={`/admin/master/${item.name}`}
                        className={`flex  justify-start items-center hover:text-[--orange] ${pathname === `/admin//master/${item.name}`}
                          ? " text-[--orange] " : "text-[--table]"}`}
                      >
                        <p>  <PiDotOutlineFill className="font-bold text-xlarge" />{" "} </p>
                        <p className={`flex justify-center items-center text-small aleo hover:text-[--orange] ${pathname === `/admin//master/${item.name}`
                          ? " text-[--orange] " : "text-[--text-color]"} `}  >
                          {item.name}
                        </p>
                      </Link>
                    )}
                  {/* <Link
                    href="/admin/master/category"
                    className={`flex  justify-start items-center text-small aleo hover:text-[--orange] ${pathname === "/master/hsn_san"
                      ? " text-[--orange] "
                      : "text-[--table]"
                      }`}
                  >
                    <p>
                      <PiDotOutlineFill className=" font-bold text-xlarge" />{" "}
                    </p>
                    <p
                      className={`flex justify-center items-center text-small aleo hover:text-[--orange]  ${pathname === "/master/hsn_san"
                        ? " text-[--orange] "
                        : "text-[--text-color]"
                        } `}
                    >
                      Categories
                    </p>
                  </Link>*/}
                </div>
              )}

            <SidebarMenu
              name="Orders"
              icon={
                <AiOutlineDropbox className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
              text="Orders"
              handleMenu={() => setsidebarOption("Orders")}
            />
            {sidebarOption === "Orders" && <div className=" grid gap-2 justify-center pl-[25px]">
              <Link
                href="/admin/orders/maintainOrders"
                className={`flex  justify-start items-center text-small aleo hover:text-[--orange] ${pathname === "/master/hsn_san"
                  ? " text-[--orange] "
                  : "text-[--table]"
                  }`}
              >
                <p>
                  <PiDotOutlineFill className=" font-bold text-xlarge" />{" "}
                </p>
                <p
                  className={`flex justify-center items-center text-small aleo hover:text-[--orange]  ${pathname === "/master/hsn_san"
                    ? " text-[--orange] "
                    : "text-[--text-color]"
                    } `}
                >
                  Maintain Orders
                </p>
              </Link>

            </div>}
            <SidebarMenu
              name="sellersetup"
              icon={
                <TbDiscount2 className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
              text=" Seller Setup"
              handleMenu={() => setsidebarOption("sellersetup")}
            />
            {/* {sidebarOption === "sellersetup" && <div>submenu of dashbaord</div>} */}
            <SidebarMenu
              name="customer"
              icon={
                <MdOutlineMan className="w-[27px] h-[27px] flex hover:text- items-center justify-center" />
              }
              pathname={pathname}
              text=" Customer"
              handleMenu={() => setsidebarOption("customer")}
            />
            {/* {sidebarOption === "customer" && <div>submenu of dashbaord</div>} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Sidebar;
