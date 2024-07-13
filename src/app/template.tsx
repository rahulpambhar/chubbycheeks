"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../app/redux/hooks";
import LoginModal from "../components/Login/index";
import path from "path";
import { ThemeProvider } from "next-themes";
import Loading from "./loading";
import toast, { Toaster } from 'react-hot-toast';

import Footer from "@/components/frontside/Footer/page";
import Navbar from "@/components/frontside/Navbar/page";
import "react-alice-carousel/lib/alice-carousel.css";

import Example from "@/components/Cart";

export default function Template({ children }: any) {
  const pathname = usePathname();
  const { data: session, status }: any = useSession();
  const isLoginModelOpen = useAppSelector(
    (state) => state.utilReducer.isLoginModelOpen
  );

  if (status === "loading") {
    return (
      <ThemeProvider>
        <Loading />
      </ThemeProvider>
    );
  }

  return (
    <div id="root">
      <div>
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        {children}
        {/* <Example/> */}
        <Footer />
      </div>
      {isLoginModelOpen && <LoginModal />}
    </div>
  );
}
