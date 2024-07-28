import Image from "next/image";
import React from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from "@/components/toster";
import { addToWishList } from "@/app/redux/slices/wishListSlice";
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { StarRating } from "../TopselectionCard/page";

const Recentviewedcard = ({
  item,
  wish
}: {
  item: any;
  wish: boolean
}) => {
  const dispatch = useAppDispatch();
  const { data: session }: any = useSession();
  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);

  const handleLike = async () => {
    if (session) {
      dispatch(addToWishList({ productId: item?.id }));
    } else {
      dispatch(isLoginModel(true));
    }
  };

  const addToCartFunction = async (id: string) => {
    const payload = { productId: id, action: "add" };
    const data = await dispatch(actionTocartFunc(payload));
    if (data.payload.st) {
      successToast(data?.payload.msg);
    } else {
      errorToast(data.payload.msg);
    }
  };

  const buyNowFunction = async (id: string) => {
    // Implement the buy now functionality here
    // This could involve directly navigating to the checkout page with the selected item
  };

  return (
    <Card shadow="lg" isPressable className="w-[250px] border border-gray-300 max-w-sm my-5  md:mx-0 mx-3">
      <CardBody className="overflow-visible p-0 relative ">
        {item?.isNew && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-md text-white text-xs font-medium">
            New Arrival
          </div>
        )}
        <Image
          loading="lazy"
          width={300}
          height={300}
          alt={item.title}
          className="w-full object-cover h-64 md:h-72"
          src={`/products/${item?.image[0]}`}
        />
        <button
          className={`absolute top-2 right-2 text-xl ${wish ? 'text-red-500' : 'text-gray-500'}`}
          style={{ zIndex: 20, pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            session ? dispatch(addToWishList({ productId: item?.id })) : dispatch(isLoginModel(true));
          }}
        >
          {wish ? '♥' : '♡'}
        </button>
      </CardBody>
      <CardFooter className="flex flex-col items-start p-2 space-y-2">
        <b className="text-lg font-semibold">{item.title}</b>
        <p className="text-sm text-gray-700">
          {item?.description.split(' ').slice(0, 15).join(' ')}...
          <Link href={`/preview/${item?.id}`} className="text-orange-500">
            More
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0">
          <StarRating rating={item?.avgRating || 5} />
          <div className="flex items-baseline space-x-2">
            <p className="text-default-500 text-sm font-bold">₹ {item.price}</p>
            <p className="text-green-500 text-sm font-semibold">
              {item?.discountType === "PERCENTAGE" ? (
                <span>{item?.discount}% off</span>
              ) : (
                <span>{item?.discount} ₹ off</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center sm:flex-row gap-2 w-full">
          <Button variant="outline" className="w-full sm:w-auto border-green-300 text-green-600 hover:bg-green-100">
            <Link href={`/buy/${item.id}`}>
              Buy Now
            </Link>
          </Button>
          {session && cart?.find((cartItem: any) => cartItem?.productId === item?.id) ? (
            <Button
              variant="outline"
              className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                session ? dispatch(setOpenCart(!openCart)) : "";
              }}
            >
              Open cart
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                session ? addToCartFunction(item?.id) : dispatch(isLoginModel(true));
              }}
            >
              Add to cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Recentviewedcard;
