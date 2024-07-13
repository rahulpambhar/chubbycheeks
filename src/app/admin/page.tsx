"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Breadcrumb from "@/components/admin/breadcrumb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import dynamic from "next/dynamic";
// import useTheme from "@/provider/ThemeProvider";

export default function Page() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);

  return (
    <>
      <div className="flex">      
        <div className="bg-red-300 w-full h-full">
        Deshboard Awaited..
        </div>
      </div>
    </>
  );
}


