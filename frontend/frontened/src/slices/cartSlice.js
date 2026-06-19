import { createSlice } from '@reduxjs/toolkit';

// Load cart items
const cartItemsFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

// Load shipping address
const shippingFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// Load payment method
const paymentMethodFromStorage =
  localStorage.getItem('paymentMethod') || '';

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingFromStorage,
  paymentMethod: paymentMethodFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ADD TO CART
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    // REMOVE FROM CART
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );

      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    // CLEAR CART
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },

    // SHIPPING
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(action.payload)
      );
    },

    // PAYMENT
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      localStorage.setItem('paymentMethod', action.payload);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;