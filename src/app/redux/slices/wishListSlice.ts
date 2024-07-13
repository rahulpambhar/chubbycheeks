import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../env"
import { successToast, errorToast } from "../../../components/toster/index"

export const fetchWhishList = createAsyncThunk('fetchwishList/wishList', async (id: string | undefined, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${apiUrl}/fetchwishList/wishList`)
        return response?.data?.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

export const addToWishList = createAsyncThunk('wishList/add', async (payload: { productId: string; }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${apiUrl}/addToWishList/wishList`, { payload })
        if (response.data?.st) {
            return response.data?.data?.whishlist;
        } else {
            errorToast(response.data.msg);
        }
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const initialState: any = {
    wishList: [],
    loading: false,
    error: null,
    status: 'idle',
};

const wishListReducer = createSlice({
    name: 'wishList',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(addToWishList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToWishList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.wishList = action.payload;
            })
            .addCase(addToWishList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

            .addCase(fetchWhishList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWhishList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.wishList = action.payload;
            })
            .addCase(fetchWhishList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })
    },
});


export const { } = wishListReducer.actions;

export default wishListReducer.reducer;