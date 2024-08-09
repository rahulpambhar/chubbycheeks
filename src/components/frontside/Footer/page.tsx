import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedinIcon, MailIcon, MountainIcon, PhoneIcon, TwitterIcon } from "@/components"

export default function Component() {
  const categories = useSelector((state: any) => state?.categories?.categories);

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6 lg:grid-cols-5">
        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">Chubby Cheeks</span>
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              <a href="#" className="text-sm">
                +91 800 055 5268
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              <a href="#" className="text-sm">
                pambharrahul@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Catalog</h4>
          <nav className="grid gap-1">
            {categories?.map((ele: any) => (
              <p key={ele.id}     >
                <Link href={`/categories/${ele.name}`} className="">
                  {ele.name}
                </Link>
              </p>
            ))}
            {/* <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Clothes
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Jewelry
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Articles
            </Link> */}
          </nav>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">About</h4>
          <nav className="grid gap-1">
            <Link href="/aboutUs" className="">
              Legacy
            </Link>
            {/* <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Our Story
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Our Team
            </Link> */}
            {/* <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Careers
            </Link> */}
          </nav>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Resources</h4>
          <nav className="grid gap-1">
            {/* <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Blog
            </Link> */}
            <Link href="/terms-and-conditions" className="text-sm  " prefetch={false}>
              Terms and Conditions
            </Link>
            <Link href="/contactUs" className="text-sm  ">
              Support
            </Link>

          </nav>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Follow Us</h4>
          <div className="flex items-center gap-2">
            <Link href="#" className="text-white hover:text-foreground" prefetch={false}>
              <FacebookIcon className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-foreground" prefetch={false}>
              <TwitterIcon className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-foreground" prefetch={false}>
              <InstagramIcon className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-foreground" prefetch={false}>
              <LinkedinIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12  border-t  border-gray-700  pt-6 text-center text-xs">
        <p>&copy; 2024 chubbycheeks.com. All rights reserved.</p>
      </div>
    </footer>
  )
}