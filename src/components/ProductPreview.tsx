"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "../app/redux/hooks";
import { actionTocartFunc } from "../app/redux/slices/cartSclice";
import { errorToast, successToast } from "@/components/toster";
import { useSession } from "next-auth/react";
import { isLoginModel, setOpenCart } from "../app/redux/slices/utilSlice";
import axios from "axios";
import { reviewSubmit, getReviews } from "@/app/redux/slices/reviewSlice";
import { type } from "os";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ openPreview, setOpenPreview, product }: any) {
  const dispatch = useAppDispatch();

  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('description');
  const [review, setReview] = useState('');
  const [ratings, setRaings] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");

  const openCart = useAppSelector((state) => state?.utilReducer?.openCart);
  const cart = useAppSelector((state) => state?.cartReducer?.cart?.CartItem) || [];
  const cartItem = cart?.find((item: any) => item?.productId === product?.id);
  const reviews = useAppSelector((state: any) => state?.reviewReducer?.reViewList) || [];
  const averageRating = useAppSelector((state: any) => state?.reviewReducer?.averageRating) || 0



  const addToCartFunction = async (id: string) => {
    const payload = { productId: id, action: "add" };
    const data = await dispatch(actionTocartFunc(payload));
    data.payload.st
      ? successToast(data?.payload.msg)
      : errorToast(data.payload.msg);
  };

  const actionTocartFunction = async (item: any, action: any) => {
    try {
      const payload = { productId: item?.productId, action };
      if (action === "remove" && item.qty === 1) {
        errorToast("Minimum 1 quantity required");
        return;
      }
      const data = await dispatch(actionTocartFunc(payload));
      data?.payload.st
        ? successToast(data?.payload.msg)
        : errorToast(data.payload.msg);
    } catch (err) {
      errorToast(err);
    }
  };



  const setSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        review, ratings, reviewTitle, id: product?.id
      }
      const data = await dispatch(reviewSubmit(payload))
      setReviewTitle("");
      setReview("");
      setRaings(0);
    } catch (error) {
      console.log('error::: ', error);
    }
  }
  useEffect(() => {
    session &&
      (async () => {
        const data = await dispatch(getReviews(product?.id));
      })();
  }, [session, product?.id]);



  useEffect(() => {
    if (!session) return;
    const myReview = reviews.find((item: any) => item?.userId === session?.user?.id && item?.productId === product.id);
    myReview && openPreview && setReview(myReview?.review);
    myReview && openPreview && setRaings(myReview?.rating);
    myReview && openPreview && setReviewTitle(myReview?.reviewTitle);
  }, [reviews, averageRating, openPreview])

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={(e) => {
        setOpenPreview(e)
        setReviewTitle("");
        setReview("");
        setRaings(0);
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-600"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity  md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => {
                      setOpenPreview(!openPreview)
                      setReviewTitle("");
                      setReview("");
                      setRaings(0);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                      {/* <Image src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" /> */}
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product?.name}</h2>

                      <section aria-labelledby="information-heading" className="mt-2">
                        <h3 id="information-heading" className="sr-only">
                          Product information
                        </h3>

                        <p className="text-2xl text-gray-900">{product?.price}</p>

                        {/* Reviews */}
                        <div className="mt-6">
                          <h4 className="sr-only">Reviews</h4>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4,].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    product?.avgRating > rating ? 'text-gray-900' : 'text-gray-200',
                                    'h-5 w-5 flex-shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                              {product?.numReviews ? product?.numReviews : 0} reviews
                            </a>
                          </div>
                        </div>
                      </section>

                      <section aria-labelledby="options-heading" className="mt-10">
                        <h3 id="options-heading" className="sr-only">
                          Product options
                        </h3>

                        <form>
                          {/* Colors
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">Color</h4>

                                                        <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                                                            <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                                            <span className="flex items-center space-x-3">
                                                                {product.colors.map((color) => (
                                                                    <RadioGroup.Option
                                                                        key={color.name}
                                                                        value={color}
                                                                        className={({ active, checked }) =>
                                                                            classNames(
                                                                                color.selectedClass,
                                                                                active && checked ? 'ring ring-offset-1' : '',
                                                                                !active && checked ? 'ring-2' : '',
                                                                                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                                                            )
                                                                        }
                                                                    >
                                                                        <RadioGroup.Label as="span" className="sr-only">
                                                                            {color.name}
                                                                        </RadioGroup.Label>
                                                                        <span
                                                                            aria-hidden="true"
                                                                            className={classNames(
                                                                                color.class,
                                                                                'h-8 w-8 rounded-full border border-black border-opacity-10'
                                                                            )}
                                                                        />
                                                                    </RadioGroup.Option>
                                                                ))}
                                                            </span>
                                                        </RadioGroup>
                                                    </div>

                                                    Sizes
                                                    <div className="mt-10">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium text-gray-900">Size</h4>
                                                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                                Size guide
                                                            </a>
                                                        </div>

                                                        <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                                            <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                            <div className="grid grid-cols-4 gap-4">
                                                                {product.sizes.map((size) => (
                                                                    <RadioGroup.Option
                                                                        key={size.name}
                                                                        value={size}
                                                                        disabled={!size.inStock}
                                                                        className={({ active }) =>
                                                                            classNames(
                                                                                size.inStock
                                                                                    ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                                    : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                                active ? 'ring-2 ring-indigo-500' : '',
                                                                                'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                            )
                                                                        }
                                                                    >
                                                                        {({ active, checked }) => (
                                                                            <>
                                                                                <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                                                                                {size.inStock ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active ? 'border' : 'border-2',
                                                                                            checked ? 'border-indigo-500' : 'border-transparent',
                                                                                            'pointer-events-none absolute -inset-px rounded-md'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                ) : (
                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                        className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                                                    >
                                                                                        <svg
                                                                                            className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                                            viewBox="0 0 100 100"
                                                                                            preserveAspectRatio="none"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                                        </svg>
                                                                                    </span>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </RadioGroup.Option>
                                                                ))}
                                                            </div>
                                                        </RadioGroup>
                                                    </div> */}

                          {
                            session && cart?.find((item: any) => item?.productId === product?.id) ?
                              <div className="max-w-md mx-auto mt-12 p-6 bg-gray-100 rounded-lg shadow-xl">
                                <h1 className="text-3xl font-semibold text-center mb-4 text-black">{cartItem?.qty}</h1>
                                <div className="flex justify-center">

                                  <button type='button'

                                    onClick={() => {
                                      session ? actionTocartFunction(cartItem, "remove") : dispatch(isLoginModel(false));
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                                  >
                                    -
                                  </button>

                                  <button type='button'
                                    onClick={() => {
                                      session ? actionTocartFunction(cartItem, "add") : dispatch(isLoginModel(false));
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
                                  >
                                    +
                                  </button>

                                </div>
                                <button
                                  type="button"
                                  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  onClick={() => {
                                    dispatch(setOpenCart(!openCart))
                                    setOpenPreview(!openPreview);
                                    setReviewTitle("");
                                    setReview("");
                                    setRaings(0);
                                  }}>
                                  Open to cart
                                </button>
                              </div>
                              :
                              <button
                                type="button"
                                className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => {
                                  if (session) {
                                    addToCartFunction(product.id);
                                  } else {
                                    setOpenPreview(!openPreview);
                                    dispatch(isLoginModel(true));
                                    setReviewTitle("");
                                    setReview("");
                                    setRaings(0);
                                  }
                                }}>
                                Add to cart
                              </button>
                          }
                        </form>
                      </section>


                      <div className="tab-content relative border border-black bottom-1 mt-3 ">
                        <div
                          className={`tab-pane bg-grey-light py-10 transition-opacity md:py-16 ${activeTab === 'reviews' ? 'active' : ''}`}
                          role="tabpanel"
                          aria-hidden={activeTab !== 'reviews'}
                        >
                          <form className="mx-auto w-5/6" onSubmit={setSubmit}>
                            <div className="grid grid-cols-1 gap-x-10 gap-y-5 pt-10 sm:grid-cols-2">

                            </div>
                            <div className="grid grid-cols-1 gap-x-10 gap-y-5 pt-10 sm:grid-cols-2">

                              <div className="w-full pt-10 sm:pt-0">
                                <label className="mb-2 block font-hk text-sm text-secondary">Rating</label>
                                <div className="flex pt-4">
                                  <input type="text" onChange={(e: any) => setRaings(e.target.value)} />
                                </div>
                              </div>
                            </div>
                            <div className="sm:w-12/25 pt-10">
                              <label
                                htmlFor="message"
                                className="mb-2 block font-hk text-sm text-secondary">Review Title</label>
                              <input
                                placeholder="Write your review here"
                                className="form-textarea h-28"
                                value={reviewTitle}
                                id="message"
                                onChange={(e) => setReviewTitle(e.target.value)}
                              >

                              </input>
                            </div>
                            <div className="sm:w-12/25 pt-10">
                              <label
                                htmlFor="message"
                                className="mb-2 block font-hk text-sm text-secondary">Review Message</label>
                              <textarea
                                placeholder="Write your review here"
                                className="form-textarea h-28"
                                id="message"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                              >
                              </textarea>
                            </div>
                            <button className="mx-auto w-5/6 pt-8 pb-4 text-center sm:text-left md:pt-10">
                              Submit Review
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>

          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

