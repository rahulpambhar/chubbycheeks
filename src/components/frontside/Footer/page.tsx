import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";



const Footer = () => {
  const categories = useSelector((state: any) => state?.categories?.categories);

  return (
    <div className="bg-black py-10 px-16">
      <div className="grid grid-cols-7 pb-5">
        <div className=" grid col-span-2">
          <img src="/image/logo.svg" alt="" />
          <div className="text-white pt-[82px] ">
            <p className="font-bold text-lg roboto uppercase"> let’s Talk</p>
            <p className="font-normal text-sm roboto pt-2">
              (+91) 8000 555 268
            </p>
            <p className="font-normal text-sm roboto">rahulpambhar@yahoo.com</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase">
            Catalogs
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}

            {categories?.map((ele: any) => (
              <p key={ele.id}     >
                <Link href={`/categories/${ele.name}`} className="">
                  {ele.name}
                </Link>
              </p>
            ))}

          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase">
            About us
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}
            <p>
              <Link href="/aboutUs" className="">
                Legacy
              </Link>
            </p>

          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase w-[300px]">
            Other
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}
            <p>
              <Link href="/contactUs" className="">
                Contact Us
              </Link>
            </p>
            {/* <p>
              <Link href="/terms-and-conditions" className="">
                Terms and Conditions
              </Link>
            </p> */}
            <p>
              <Link href="/privacyPolicy" className="">
                Privacy Policy
              </Link>
            </p>

          </div>
        </div>
        <div className="col-span-2">
          <div className="grid justify-end gap-5 ">
            <p className="text-xl font-bold roboto text-white uppercase text-right">
              Follow us
            </p>
            <img src="/image/socialmedia.svg" alt="" />
          </div>
          <div className="flex items-center justify-end pt-20 gap-3">
            <div className="flex flex-col text-right">
              <p className="font-medium text-xs roboto uppercase text-white">
                Chat via
              </p>
              <p className="font-bold text-lg roboto uppercase text-white">
                whatsapp{" "}
              </p>
            </div>
            <img src="/image/whatsapp.svg" alt="" className="bg-white p-2" />
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-center items-center  pt-5">
        <p className="font-normal text-lg text-white">
          © 2024 chubbycheeks.com. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
