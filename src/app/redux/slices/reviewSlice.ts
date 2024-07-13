import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../env"
import { successToast, errorToast } from "../../../components/toster/index"
import { payload } from "../../../../types/global";

export const getReviews = createAsyncThunk('/fetchReviewRatings/reviewRatings', async (id_: string, { rejectWithValue }) => {
    const id: string = id_
    try {
        const response = await axios.get(`${apiUrl}/fetchReviewRatings/reviewRatings?id=${id}`)
        return response?.data?.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});


export const reviewSubmit = createAsyncThunk('wishList/add', async (payload: payload, { rejectWithValue }) => {

    try {
        const response = await axios.post(`${apiUrl}/addReviewRatings/reviewRatings`, { payload })
        if (response.data?.st) {
            successToast(response.data.msg);
            return response.data?.data;
        } else {
            errorToast(response.data.msg);
        }
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const initialState: any = {
    reViewList: [],
    averageRating: 0,
    loading: false,
    error: null,
    status: 'idle',
};

const reViewListReducer = createSlice({
    name: 'reViewList',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(reviewSubmit.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(reviewSubmit.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reViewList = action?.payload?.reviews;
                state.averageRating = action?.payload?.averageRating;
            })
            .addCase(reviewSubmit.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

            .addCase(getReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reViewList = action?.payload?.reviews;
                state.averageRating = action?.payload?.averageRating;
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })
    },
});


export const { } = reViewListReducer.actions;

export default reViewListReducer.reducer;