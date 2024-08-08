"use client";
import { Fragment, use, useEffect, useMemo, useState, } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import Link from 'next/link';
import moment from "moment"
import Unitedfreecard from "@/components/frontside/unitedfree/page";
import { FaCircle, FaStar, FaTrash } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { reviewSubmit, getReviews } from "@/app/redux/slices/reviewSlice";
import ProductPreview from '../../../../components/ProductPreview';
import Image from "next/image";
import { FaEdit } from 'react-icons/fa';
import { DateRange } from "react-day-picker"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/frontside/TopselectionCard/page"
import { addToWishList } from "@/app/redux/slices/wishListSlice";
import { isLoginModel } from '@/app/redux/slices/utilSlice';
import { HeartIcon, RedHeartIcon } from '@/components';
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { actionTocartFunc } from '@/app/redux/slices/cartSclice';
import Cart from "@/components/Cart"

export default function Checkout({ params }: { params: { product: string } }) {
    const productsList: any = useSelector((state: any) => state.categories.productsList);
    const averageRating = useAppSelector((state: any) => state?.reviewReducer?.averageRating) || 0
    const reviews = useAppSelector((state: any) => state?.reviewReducer?.reViewList) || [];
    const cart = useAppSelector((state: any) => state?.cartReducer?.cart?.CartItem) || [];
    const openCart = useAppSelector((state: any) => state?.utilReducer?.openCart);

    const product = productsList.find((item: any) => item.id === params?.product);
    const filteredProducts = productsList.filter((item: any) => item?.categoryId === product?.categoryId && item?.id !== product?.id);
    const [showModal, setShowModal] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, text: '', });
    const [productSize, setSize] = useState("NONE");
    console.log('productSize::: ', productSize);
    const fallbackImage = '/image/offer.jpg';

    const { data: session, status }: any = useSession();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const search = searchParams.get('wish')
    const orders: any[] = useAppSelector((state: any) => state?.orderReducer?.orders);
    const [info, setInfo] = useState("reviews");
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const [date, setDate] = useState<DateRange | undefined>({ from: oneMonthAgo, to: today, })
    const wishList = useAppSelector((state: any) => state?.wishListReducer?.wishList);
    const wish = !!wishList?.find((wish: any) => wish?.productId === product?.id);

    const isCurrentUserReviewed = useMemo(() => {
        return reviews.some((review: any) => review?.userId === session?.user?.id && review?.productId === product.id);
    }, [reviews, session?.user?.id]);

    let images_video = [];

    if (product?.image && product?.image.length > 0) {
        product.image.forEach((item: any, index: number) => {
            images_video.push(
                <div className="item" key={`image-${index}`}>
                    <img src={`/products/${item}`} alt={`Image ${index}`} className="media h-[600px] w-[500px] object-cover object-center p-2 rounded-xl" />
                </div>
            );
        });
    }


    if (product?.video) {
        images_video.push(
            <div className="item" key="video">
                <video width="100%" controls autoPlay loop muted className="media">
                    <source src={`/products/video/${product.video}`} />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    const addToCartFunction = async (id: string, productSize: string) => {
        const payload = { productId: id, action: "add", productSize };
        const data = await dispatch(actionTocartFunc(payload));
        if (data.payload.st) {
            successToast(data?.payload.msg);
        } else {
            errorToast(data.payload.msg);
        }
    };

    const setSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const payload = {
                review: newReview.text, ratings: newReview.rating, id: product?.id
            }
            const data = await dispatch(reviewSubmit(payload))
            setNewReview({ rating: 0, text: '', });
            setShowModal(false)

        } catch (error) {
            console.log('error::: ', error);
        }
    }

    useEffect(() => {
        session && product?.id &&
            (async () => {
                const data = await dispatch(getReviews(product?.id));
                const orders: any = await dispatch(getOrdersFunc({ page: 1, limit: 1000, search: "", from: date?.from?.toString(), to: date?.to?.toString(), slug: "getAll", }));
                const payload = orders?.payload?.data

                payload?.some((item: any) => {

                    if (item?.orderStatus === "COMPLETE") {
                        const purchaseFilter = item?.OrderItem?.some((item: any) => item?.productId === product?.id);

                        if (purchaseFilter) {
                            setIsPurchased(true);
                            return true;
                        }
                    }
                    return false;
                });
            })();
    }, [session, product?.id]);

    useEffect(() => {
        let getRecentView: any = localStorage?.getItem('recentVw');
        let getParsed: any = JSON?.parse(getRecentView);
        if (getParsed?.length > 0) {
            const isIdAvail = getParsed?.some((item: any) => { return item === params?.product });

            if (!isIdAvail) {
                if (getParsed?.length > 4) {
                    getParsed.splice(0, 1)
                    getParsed?.push(params?.product)
                    localStorage.setItem('recentVw', JSON.stringify(getParsed));
                } else {
                    getParsed?.push(params?.product)
                    localStorage.setItem('recentVw', JSON.stringify(getParsed));
                }
            }
        } else {
            const firstProductId = [params?.product]
            localStorage.setItem('recentVw', JSON.stringify(firstProductId));
        }
    }, []);

    useEffect(() => {
        session && cart?.find((cartItem: any) => cartItem?.productId === product?.id) && setSize(cart?.find((cartItem: any) => cartItem?.productId === product?.id)?.size);
 }, [session, cart]);

    return (
        <>
            <div className="max-w-7xl px-4 mx-auto py-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start bg-white p-6 rounded-lg shadow-md">
                    <div className="grid gap-4 md:gap-10 items-start">
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <Carousel showThumbs={false} infiniteLoop={true} showStatus={false}>
                                {images_video}
                            </Carousel>
                        </div>
                    </div>

                    {
                        product ? <div className="grid gap-4 md:gap-10 items-start">
                            <div className="relative grid gap-2">
                                <h1 className="font-bold text-3xl lg:text-4xl">{product?.name}</h1>
                                <button
                                    className={`absolute top-2 right-2 text-xl ${wish ? 'text-red-500' : 'text-black'}`}
                                    style={{ zIndex: 20, pointerEvents: 'auto' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        session ? dispatch(addToWishList({ productId: product?.id })) : dispatch(isLoginModel(true));
                                    }}
                                >
                                    {wish ? <RedHeartIcon /> : <HeartIcon />}
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-0.5">
                                        <StarRating rating={product?.avgRating || 5} />
                                    </div>
                                    <div className="text-sm text-muted-foreground">({product?.avgRating || 5} out of 5)</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl font-bold">₹{
                                        product?.discountType === "PERCENTAGE" ?
                                            product?.price - ((product?.price) * product?.discount / 100) :
                                            product?.price - product?.discount
                                    } </div>
                                    <div className="text-sm text-muted-foreground line-through">₹ {product.price}</div>
                                    <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                        {product?.discountType === "PERCENTAGE" ? (
                                            <span>{product?.discount}% off</span>
                                        ) : (
                                            <span>{product?.discount} ₹ off</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4 text-sm leading-loose">
                                <p>
                                    {product?.description}
                                </p>
                                <div className="flex">
                                    <div className="font-semibold">Available Size :</div>
                                    <div className="flex ml-2 items-center gap-2">
                                        {session && cart?.find((cartItem: any) => cartItem?.productId === product?.id) ? "" : ""}

                                        <ToggleGroup type="single" value={productSize} variant="outline" onValueChange={(value: any) => {
                                            setSize(value);
                                        }}
                                        >
                                            {
                                                product?.size?.map((item: any) => (
                                                    <ToggleGroupItem
                                                        key={item}
                                                        value={item}
                                                        className="w-8 h-8 bg-black text-gray-200 border border-green-700"
                                                    >
                                                        {item}
                                                    </ToggleGroupItem>
                                                ))
                                            }
                                        </ToggleGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {session && cart?.find((cartItem: any) => cartItem?.productId === product?.id) ? (
                                    <Button
                                        size="lg" className="flex-1"
                                        onClick={() => {
                                            session ? dispatch(setOpenCart(!openCart)) : "";
                                        }}
                                    >
                                        Open cart
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg" className="flex-1"
                                        onClick={() => {
                                            session ? addToCartFunction(product?.id, productSize) : dispatch(isLoginModel(true));
                                        }}
                                    >
                                        Add to cart
                                    </Button>
                                )}
                                <Button size="lg" className="flex-1">
                                    <Link href={`/buy/${product?.id}`} >
                                        Buy Now
                                    </Link>
                                </Button>
                            </div>
                        </div> : "No data found"
                    }
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-5 space-x-4">
                        <button
                            className={`p-3 ${info === "reviews" ? "bg-gray-300" : ""} rounded-lg shadow-md`}
                            onClick={() => setInfo("reviews")}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="bg-gray-100 p-5 rounded-lg">
                        <>
                            {session && isPurchased && !isCurrentUserReviewed && (
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                                    >
                                        Add Review
                                    </button>
                                </div>
                            )}
                            <div className="max-h-96 overflow-y-auto space-y-4">
                                {reviews.map((review: any) => (
                                    <div key={review.id} className="p-4 border rounded-lg bg-white bg-opacity-75 shadow-lg flex items-center space-x-4">
                                        <div className="w-10">
                                            <Image src={`/users/${review?.user?.profile_pic}` || fallbackImage} alt={`Review ${review.id}`} width={100} height={100} className="w-full rounded-lg" />
                                        </div>
                                        <div className="w-3/4">
                                            <div className="flex items-center mb-1">
                                                {[...Array(5)].map((star, index) => (
                                                    <FaStar
                                                        key={index}
                                                        className={`mr-1 ${index < review?.rating ? "text-yellow-500" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-800 mb-1">{review?.review}</p>
                                            <p className="text-gray-500 text-sm">- {review?.user?.name}, {review?.user?.country}</p>
                                        </div>
                                        {session?.user.id === review?.user?.id && (
                                            <div>
                                                <button className="flex gap-2" onClick={() => { setShowModal(true); setNewReview({ rating: review?.rating, text: review?.review }) }}>
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
                    <p>Related Products</p>
                </div>
                <p className="flex justify-center">
                    Get the latest updates
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-10  lg:mx-44 gap-5 ">
                    {filteredProducts.map((item: any) => (
                        <Unitedfreecard
                            key={item.id}
                            id={item.id}
                            image={`${item?.image[0]}`}
                            price={item?.price}
                            label={item?.label}
                            averageRating={averageRating}
                            discription={item?.description}
                        />
                    ))}
                </div>
                <div className="hidden lg:flex justify-center items-center py-11">
                    <img src="/image/Slider.svg" alt="" />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-300 p-5 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-xl mb-4">Add a Review</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex items-center">
                                {[...Array(5)].map((star, index) => (
                                    <FaStar
                                        key={index}
                                        className={`cursor-pointer ${index < newReview.rating ? "text-green-500" : "text-gray-600 "}`}
                                        onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Review</label>
                            <textarea
                                className="w-full bg-gray-200 p-2 border rounded-lg"
                                rows={2}
                                value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => { setShowModal(false); setNewReview({ rating: 0, text: '', }); }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={setSubmit}
                                className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-300 transition duration-300"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Cart />
        </>
    )
}


// export default function Checkout({ params }: { params: { product: string } }) {

//     return (
//         <>
//             {/* <div className="grid grid-cols-2 w-full h-full mt-5">

//                 <div className="carousel-container ">
//                     <Carousel showThumbs={false}>
//                         {images_video}
//                     </Carousel>
//                 </div>

//                 <div className="bg-white p-5 ">
//                     <div className="border-gray-400 pb-5  border-b-2">
//                         <div className="flex items-center gap-5">
//                             <p className="text-4xl font-medium">{product?.name}</p>
//                             <div className="text-xl font-light bg-green-900 text-white px-3 py-1 rounded-full">
//                                 {product?.discountType === "PERCENTAGE" ? <span className="text-sm">{product?.discount}% OFF</span> :
//                                     <span className="text-sm">{product?.discount} ₹ OFF</span>
//                                 }
//                             </div>
//                         </div>
//                         <div className="flex py-2 items-center gap-5">
//                             {product?.discountType === "PERCENTAGE" ? <span className="text-2xl">₹ {product?.price - product?.price * product?.discount / 100}</span> :
//                                 <span className="text-2xl">₹ {product?.price - product?.discount} </span>
//                             }
//                             <p> {product?.price}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="flex gap-1 text-sm text-orange-900">
//                                 <FaStar />
//                                 <FaStar />
//                                 <FaStar />
//                                 <FaStar />
//                                 <FaStar />
//                             </div>
//                             <p className="text-sm">(45)</p>
//                         </div>
//                     </div>
//                     <div className="py-5">
//                         <div className="font-medium flex items-center gap-3">
//                             <p>Availability:</p>
//                             <p className="text-green-300">In Stock</p>
//                         </div>
//                         <p className="py-5">
//                             Versatile, comfortable, and chic! Three words that describe Blake
//                             by Elyssi.
//                         </p>
//                         <div className="grid grid-cols-7 items-center gap-5">
//                             <p>Color</p>
//                             <div className="flex gap-1">
//                                 <FaCircle />
//                                 <FaCircle />
//                                 <FaCircle />
//                                 <FaCircle />
//                             </div>
//                         </div>{" "}
//                         <div className="grid grid-cols-7 items-center gap-5 py-5">
//                             <p>size</p>
//                             <div className="col-span-3">
//                                 <input type="text" placeholder="small" className="w-full" />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-7 items-center gap-5 py-5">
//                             <p>Quantity</p>
//                             <div className="col-span-3">
//                                 <input type="text" placeholder="small" className="w-full" />
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-5">
//                             <button>Add to cart </button>
//                             <button> buy now</button>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}

{/* <div className="grid md:grid-cols-2 gap-6 lg:gap-12   border border-black  items-start max-w-6xl px-4 mx-auto py-6">
<div className="grid gap-4 md:gap-10 items-start">
    <img
        src="/placeholder.svg"
        alt="Product Image"
        width={600}
        height={300}
        className="aspect-[2/3] object-cover  w-full border border-black h-[56vh] rounded-lg overflow-hidden"
    />
</div>

<div className="grid gap-4 md:gap-10    items-start">
    <div className="grid gap-2">
        <h1 className="font-bold text-3xl lg:text-4xl">Cozy Cotton Crew Neck Sweater</h1>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-0.5">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">(4.3 out of 5)</div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">$59.99</div>
            <div className="text-sm text-muted-foreground line-through">$79.99</div>
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">25% OFF</div>
        </div>
    </div>
    <div className="grid gap-4 text-sm leading-loose">
        <p>
            {/* Crafted from premium cotton, this cozy crew neck sweater is the perfect addition to your wardrobe. With a
            classic design and comfortable fit, it's ideal for everyday wear or layering during the colder months. */}
//         </p>
//         <div className="grid gap-2">
//             <div className="font-semibold">Size:</div>
//             <div className="flex items-center gap-2">
//                 <ToggleGroup type="single" defaultValue="m" variant="outline">
//                     <ToggleGroupItem value="s">S</ToggleGroupItem>
//                     <ToggleGroupItem value="m">M</ToggleGroupItem>
//                     <ToggleGroupItem value="l">L</ToggleGroupItem>
//                     <ToggleGroupItem value="xl">XL</ToggleGroupItem>
//                 </ToggleGroup>
//             </div>
//         </div>
//     </div>
//     <Button size="lg">Add to Cart</Button>
//     <Button size="lg">Buy Now</Button>
// </div>
// </div>

{/* <div className="grid border border-black bg-white mt-2 p-5">
<div className="flex items-center mb-5">
    <button
        className={`p-3 ${info === "description" ? "bg-gray-300" : ""}`}
        onClick={() => setInfo("description")}
    >
        Description
    </button>
    <button
        className={`p-3 ${info === "reviews" ? "bg-gray-300" : ""}`}
        onClick={() => setInfo("reviews")}
    >
        Reviews
    </button>
</div>
<div className="bg-gray-100 p-5 rounded-lg">
    {info === "description" && (
        <>
            <p>{product?.description}</p>
        </>
    )}
    {info === "reviews" && (
        <>
            {
                session && isPurchased && !isCurrentUserReviewed &&
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                    >
                        Add Review
                    </button>
                </div>

            }
            <div className="max-h-96 overflow-y-auto">
                {reviews.map((review: any) => (
                    <div key={review.id} className="mb-2 p-4 border rounded-lg bg-white bg-opacity-75 shadow-lg flex items-center space-x-4">
                        <div className="w-10">
                            <Image src={`/users/${review?.user?.profile_pic}` || fallbackImage} alt={`Review ${review.id}`} width={100} height={100} className="w-full  rounded-lg" />
                        </div>
                        <div className="w-3/4">
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((star, index) => (
                                    <FaStar
                                        key={index}
                                        className={`mr-1 ${index < review?.rating ? "text-yellow-500" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-800 mb-1">{review?.review}</p>
                            <p className="text-gray-500 text-sm">- {review?.user?.name}, {review?.user?.country}</p>
                        </div>
                        {
                            session?.user.id === review?.user?.id &&
                            <div>
                                <button className='flex gap-2' onClick={() => { setShowModal(true); setNewReview({ rating: review?.rating, text: review?.review, }) }} >
                                    <FaEdit />
                                </button>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </>
    )}
</div>
</div> */}

//           

//         </>
//     )
// }

