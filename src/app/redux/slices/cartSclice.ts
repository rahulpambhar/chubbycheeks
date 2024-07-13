import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../env"

const fetchCart = createAsyncThunk('cart/fetchCart', async (id: string | undefined, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${apiUrl}/getCart/cart`)
        return response.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const actionTocartFunc = createAsyncThunk('cart/createCart', async (payload: { productId: string; action: string }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${apiUrl}/addCart/cart`, { payload })
        return response?.data;
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return rejectWithValue(errorMessage);
    }
});

const initialState: any = {
    cart: {},
    cartItem: [],
    loading: false,
    error: null,
    status: 'idle',
};

const cartReducer = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: any) => {
            state.categories.push(action.payload);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(actionTocartFunc.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(actionTocartFunc.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload?.data;
                state.cartItem = action.payload?.data?.CartItem?.map((item: any) => {
                    return { ...item, checked: true }
                });
                state.loading = false;
            })
            .addCase(actionTocartFunc.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
                state.loading = false;
            })

            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload?.data;
                state.cartItem = action.payload?.data?.CartItem?.map((item: any) => {
                    return { ...item, checked: true }
                });
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
                state.loading = false;
            });
    },
});

export { actionTocartFunc, fetchCart };
export const {
    // addCategories,
    // updateCategories,
    // deleteCategories,
    // deleteAllCategories,
} = cartReducer.actions;

export default cartReducer.reducer;