"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from '../../../../app/redux/hooks';
import { fetchCart } from '../../../../app/redux/slices/cartSclice';
import { isLoginModel, setOpenCart } from '../../../../app/redux/slices/utilSlice';
import { fetchWhishList } from "@/app/redux/slices/wishListSlice";
import { fetchCategories } from '@/app/redux/slices/categorySlice';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MenuIcon, HeartIcon, ShoppingCartIcon } from "@/components";
import { errorToast } from "@/components/toster";

export default function Component() {
  const { data: session }: any = useSession();
  const isLoginModelOpen = useAppSelector((state) => state.utilReducer.isLoginModelOpen);
  const cart = useAppSelector((state) => state.cartReducer.cart);
  const wishList = useAppSelector((state) => state.wishListReducer.wishList);
  const categories = useAppSelector((state) => state.categories.categories);
  const openCart = useAppSelector((state) => state.utilReducer.openCart);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) {
      dispatch(fetchCart());
      dispatch(fetchWhishList());
    }
    dispatch(fetchCategories());
  }, [session, dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between py-2 sm:h-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center" prefetch={false}>
            <Image width={100} height={100} src="/image/chubbycheeks/logo.png" className="mt-4 w-30 h-30" alt="Logo" />
          </Link>

          <nav className="hidden space-x-4 md:flex">
            <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-1 focus:ring-ring text-white" prefetch={false}>
              Home
            </Link>
            {categories?.map((ele: any) => (
              <Link key={ele.id} href={`/categories/${ele.name}`} className="rounded-md px-3 capitalize-first py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-1 focus:ring-ring text-white">
                {ele.name}
              </Link>
            ))}
            <Link href="/aboutUs" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-1 focus:ring-ring text-white" prefetch={false}>
              About
            </Link>
            <Link href="/contactUs" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-1 focus:ring-ring text-white" prefetch={false}>
              Contact
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden text-white">
              <MenuIcon className="h-5 w-5 text-white" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 text-white bg-black border-none">
            <Link href="/" className="mr-4 flex items-center" prefetch={false}>
              <Image width={100} height={100} src="/image/chubbycheeks/logo.png" className="mt-4 w-40 h-30" alt="Logo" />
            </Link>
            <nav className="grid mt-20 gap-6 text-lg font-medium text-white">
              <Link href="/" className="flex items-center gap-4 px-2.5 text-white" prefetch={false}>
                Home
              </Link>
              {categories?.map((ele: any) => (
                <Link key={ele.id} href={`/categories/${ele.name}`} className="flex items-center gap-4 px-2.5 text-white capitalize-first">
                  {ele.name}
                </Link>
              ))}
              <Link href="/aboutUs" className="flex items-center gap-4 px-2.5 text-white" prefetch={false}>
                About
              </Link>
              <Link href="/contactUs" className="flex items-center gap-4 px-2.5 text-white" prefetch={false}>
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full text-white relative">
                <Link href="/profile?wish=1">
                  <HeartIcon className="h-5 w-5 hover:text-black text-white" />
                </Link>
                <span className="sr-only">Wishlist</span>
                {wishList && wishList.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {wishList.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-white relative">
                <ShoppingCartIcon className="h-5 w-5 hover:text-black text-white" onClick={() => {
                cart.CartItem.length > 0 ?  dispatch(setOpenCart(!openCart)): errorToast("Cart is empty") }} />
                <span className="sr-only">Cart</span>
                {cart && cart.CartItem?.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cart.CartItem.length}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm font-medium">{session?.user?.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-white">
                      <img src={`/users/${session?.user?.profile_pic}`} width="36" height="36" alt="User Avatar" className="rounded-full" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black text-white">
                    <DropdownMenuLabel className="text-white">{session?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-white">
                      <Link href="/profile" className="" prefetch={false}>
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white">
                      <Link href="/profile?orders=1" className="" prefetch={false}>
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-white" onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-white">
              <button onClick={() => dispatch(isLoginModel(!isLoginModelOpen))} className="fontFamily text-white">
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
