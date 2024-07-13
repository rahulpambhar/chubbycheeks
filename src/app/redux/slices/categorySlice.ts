import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../env"


const initialState: any = {
    allCategories: [], // all categories
    categories: [], // catagory whose have more than zero subcategory
    subCategories: [],
    productsList: [],
    products: [],
    loading: false,
    error: null,
    status: 'idle',
};
export const fetchCategories: any = createAsyncThunk('categories/fetchCategories', async () => {
    try {
        const page = 1
        const limit = 100
        const response = await axios.get(`${apiUrl}/admin/category?page=${page}&limit=${limit}`)
        // const response = await axios.get(`${process.env.API_URL}/admin/category?page=${page}&limit=${limit}`)
        return response.data;
    } catch (error) {
        throw error;
    }
});

const categoriesReducer = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setProducts: (state, action: any) => {
            state.products = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload?.data;

                let allCategories: any = []
                let categories: any = []
                let products: any = []
                let subCategories: any = []

                for (let x in action.payload?.data) {
                    if (action.payload?.data[x].SubCategory.length > 0) {
                        categories.push(action.payload?.data[x])
                    }
                    allCategories.push({ id: action.payload?.data[x].id, name: action.payload?.data[x].name })
                }

                state.categories = categories
                state.allCategories = allCategories

                for (let x in state.categories) {
                    if (state.categories[x].SubCategory.length > 0) {
                        for (let y in state.categories[x].SubCategory) {
                            if (state.categories[x].SubCategory[y].products.length > 0) {
                                for (let z in state.categories[x].SubCategory[y].products) {
                                    products.push(state.categories[x].SubCategory[y].products[z])
                                }
                            }
                        }
                    }
                }
                state.subCategories = subCategories
                state.productsList = products
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
    },
});

export const {
    setProducts,
    // updateCategories,
    // deleteCategories,
    // deleteAllCategories,
} = categoriesReducer.actions;

export default categoriesReducer.reducer;


