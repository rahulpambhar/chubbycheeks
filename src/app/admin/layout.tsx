"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";

export default function Template({ children }: any) {


  return (
    <div className="flex bg-[--bodybackground] ">
      <div className={`shrink-0 h-screen "w-60" hidden lg:block transition-all duration-300 ease-linear`}   >
        <Sidebar />
      </div>
      <div className=" flex-grow">
        <div className="md:h-[calc(100vh-1px)] overflow-y-scroll scrollbar-remove px-4  bg-green-100">
          {children}
        </div>
      </div>
    </div>
  );
}
