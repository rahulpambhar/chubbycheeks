import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const initialState: any = {
    isLoginModelOpen: false,
    openCart: false,
};

const utilReducer = createSlice({
    name: 'util',
    initialState,
    reducers: {
        isLoginModel: (state, action: PayloadAction<boolean>) => {
            state.isLoginModelOpen = action.payload;
        },
        setOpenCart: (state, action: PayloadAction<boolean>) => {
            state.openCart = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export const {
    isLoginModel, setOpenCart
} = utilReducer.actions;

export default utilReducer.reducer;