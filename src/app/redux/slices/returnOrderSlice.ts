import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
interface ThunkApiConfig {
    rejectWithValue: any;
}

export const getReturnOrdersFunc = createAsyncThunk('returnOrder/getReturnOrderFunc', async ({ page, limit, search, from, to, slug, }: { page: number; limit: number; search: any; from: any, to: any, slug: string }, thunkApiConfig: ThunkApiConfig) => {
    const { rejectWithValue } = thunkApiConfig;
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search.toString(),
            from: from.toString(),
            to: to.toString(),
            slug: slug.toString()
        }).toString();

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/return/returnOrder?${params}`)
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

export const updateReturnOrdersFunc = createAsyncThunk('returnOrder/updateReturnOrdersFunc', async ({ id, data, orderStatus }: { id: any, data: any, orderStatus: string }, thunkApiConfig: ThunkApiConfig) => {
    const { rejectWithValue } = thunkApiConfig;
    try {
        const payload = { id, data, orderStatus }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/slug/returnOrder`, payload)
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});


const initialState: any = {
    returnOrders: [],
    returnOrderId: {},
    loading: false,
    error: null,
    status: 'idle',
};

const returnOrderReducer = createSlice({
    name: 'returnOrder',
    initialState,
    reducers: {
        addToCart: (state, action: any) => {
            state.categories.push(action.payload);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getReturnOrdersFunc.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getReturnOrdersFunc.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.returnOrders = action.payload?.data;
                state.returnOrderId = action.payload?.data?.data;

            })
            .addCase(getReturnOrdersFunc.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })
    },
});

export const {

} = returnOrderReducer.actions;

export default returnOrderReducer.reducer;