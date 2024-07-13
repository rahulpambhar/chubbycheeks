"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";

export default function Template({ children }: any) {
  const pathname = usePathname();
  const { data: session, status }: any = useSession();

  return (
    // <div id="root">
    //     {children}
    //     {status === "authenticated" && session?.user?.isAdmin && pathname.startsWith("/admin") && <Sidebar />}
    // </div>
    <div className="flex bg-[--bodybackground] ">
      <div
        className={`shrink-0 h-screen "w-60" hidden lg:block transition-all duration-300 ease-linear`}
      >
        <Sidebar />
      </div>
      <div className=" flex-grow">
        <div className="md:h-[calc(100vh-1px)] overflow-y-scroll scrollbar-remove px-4  bg-[#78ABA8]">
          {children}
        </div>
      </div>
    </div>
  );
}
