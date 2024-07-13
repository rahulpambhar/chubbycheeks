"use client";
import { usePathname } from "next/navigation";
import React from "react";

function Breadcrumb() {
  const pathname = usePathname();

  return (
    <div>
      <div className="breadcrumb-title position mb-4 bg-blue-200">
        <ul>
          <li>
            <a
              href=""
              className="font-sz-yello font-family"
              style={{ textTransform: "capitalize" }}
            >
              Home /{" "}
            </a>
          </li>
          <li className="font-sz-yello font-family text-whitez">
            {pathname === "/dashboard"
              ? "dashboard"
              : pathname === "/dashboard/category"
              ? "category"
              : pathname === "/dashboard/subCategory"
              ? "subCategory"
              : pathname === "/dashboard/products"
              ? "products"
              : "profile"}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Breadcrumb;
