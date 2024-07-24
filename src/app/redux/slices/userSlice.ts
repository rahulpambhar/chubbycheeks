import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { successToast, errorToast } from "../../../components/toster/index"
import { payload } from "../../../../types/global";

export const getUser= createAsyncThunk('/fetchUser/user', async (id_: string, { rejectWithValue }) => {
    const id: string = id_
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUser/signup?id=${id}`)
        return response?.data?.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});



const initialState: any = {
    user: {},
    loading: false,
    error: null,
    status: 'idle',
};

const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUser.fulfilled, (state, action) => {

                state.status = 'succeeded';
                state.user = action?.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

    },
});


export const { } = userReducer.actions;

export default userReducer.reducer;