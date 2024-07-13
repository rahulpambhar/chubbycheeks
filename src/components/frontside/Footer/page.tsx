import React from "react";

const Footer = () => {
  return (
    <div className="bg-black py-10 px-16">
      <div className="grid grid-cols-7 pb-5">
        <div className=" grid col-span-2">
          <img src="/image/logo.svg" alt="" />
          <div className="text-white pt-[82px] ">
            <p className="font-bold text-lg roboto uppercase"> let’s Talk</p>
            <p className="font-normal text-sm roboto pt-2">
              (+91) 333 2568 4593
            </p>
            <p className="font-normal text-sm roboto">hello@neuronthemes.com</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase">
            Products
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}
            <p>Nail Polish</p>
            <p>Base & Top Coats</p>
            <p>Nail Care</p>
            <p>Sweepstakes</p>
            <p>Virtual Try On</p>
            <p>Nail Care</p>
            <p>Sweepstakes</p>
            <p>Virtual Try On</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase">
            About us
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}
            <p>Nail Polish</p>
            <p>Base & Top Coats</p>
            <p>Nail Care</p>
            <p>Sweepstakes</p>
            <p>Virtual Try On</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold roboto text-white uppercase">
            Customer Service
          </p>
          <div className="text-sm font-normal roboto grid gap-1 text-white pt-10">
            {" "}
            <p>Nail Polish</p>
            <p>Base & Top Coats</p>
            <p>Nail Care</p>
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
          Koffeekodes IT Solutions.
        </p>
      </div>
    </div>
  );
};

export default Footer;
