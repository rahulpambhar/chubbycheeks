import mongoose from "mongoose";
import Web3 from "web3";

// Use type safe message keys with `next-intl`
type Messages = typeof import('../language/en.json');
declare interface IntlMessages extends Messages { }

type theme = 'dark' | 'light';

interface Product {
    avgRating: number | null;
    batchNo: string;
    brand: string;
    categoryId: string;
    countInStock: number;
    createdAt: string; // ISO 8601 date string
    description: string;
    discount: number;
    discountedPrice: number;
    id: string;
    image: string[]; // Array of image URLs
    isBlocked: boolean;
    name: string;
    numReviews: number | null;
    price: number;
    subCategoryId: string;
    uid: string;
    updatedAt: string; // ISO 8601 date string
    userId: string;
    video: string;
}

interface SubCategory {
    id: string;
    categoryId: string;
    name: string;
    image: string;
    isBlocked: boolean;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    userId: string;
    products: Product[];
}


interface Categories {
    id: string;
    name: string;
    image: string;
    isBlocked: boolean;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    userId: string;
    subcategories: SubCategory[];
}
type payload = {
    review: string;
    ratings: number;
    id: any;

}


interface CategoriesState {
    categories: SubCategory[];
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}