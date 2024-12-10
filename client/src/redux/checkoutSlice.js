import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        cart: [], // Cart items
        shippingInfo: {}, // Shipping information
        discountCode: '', // Discount code
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload; // Set cart items
        },
        setShippingInfo: (state, action) => {
            state.shippingInfo = action.payload; // Set shipping information
        },
        setDiscountCode: (state, action) => {
            state.discountCode = action.payload; // Set discount code
        },
        clearCheckout: (state) => {
            state.cart = [];
            state.shippingInfo = {};
            state.discountCode = '';
        },
    },
});

export const { setCart, setShippingInfo, setDiscountCode, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
