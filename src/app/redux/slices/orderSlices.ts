import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
interface ThunkApiConfig {
    rejectWithValue: any;
}



export const createTempOrderFunc = createAsyncThunk('order/creteTempOrder', async (orderMeta: any, thunkApiConfig: ThunkApiConfig) => {

    const { rejectWithValue } = thunkApiConfig;
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createOrder/tempOrder`, { orderMeta })
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

export const createOrderFunc = createAsyncThunk('order/creteOrder', async (orderInfo: any, thunkApiConfig: ThunkApiConfig) => {
    const { rejectWithValue } = thunkApiConfig;
    try {

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createOrder/order`, { orderInfo })
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

export const getOrdersFunc = createAsyncThunk('order/getOrdersFunc', async ({ page, limit, search, from, to, slug, }: { page: number; limit: number; search: any; from: any, to: any, slug: string }, thunkApiConfig: ThunkApiConfig) => {
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

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/createOrder/order?${params}`);
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

export const updateOrdersFunc = createAsyncThunk('order/updateOrdersFunc', async ({ id, data, orderStatus }: { id: any, data: any, orderStatus: string }, thunkApiConfig: ThunkApiConfig) => {
    const { rejectWithValue } = thunkApiConfig;
    try {
        const payload = { id, data, orderStatus }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/createOrder/order`, payload)
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const initialState: any = {
    orders: [],
    loading: false,
    error: null,
    status: 'idle',
};

const orderReducer = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addToCart: (state, action: any) => {
            state.categories.push(action.payload);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getOrdersFunc.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getOrdersFunc.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload?.data;
            })
            .addCase(getOrdersFunc.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

    },
});

export const {

} = orderReducer.actions;

export default orderReducer.reducer;