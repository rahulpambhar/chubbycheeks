import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../env.js"
interface ThunkApiConfig {
    rejectWithValue: any;
}

export const getReturnOrdersFunc = createAsyncThunk('returnOrder/getReturnOrderFunc', async (_, thunkApiConfig: ThunkApiConfig) => {
    const { rejectWithValue } = thunkApiConfig;
    try {
        const response = await axios.get(`${apiUrl}/return/returnOrder/getAll`)
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const initialState: any = {
    returnOrders: [],
    loading: false,
    error: null,
    status: 'idle',
};

const returnOrderReducer = createSlice({
    name: 'order',
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