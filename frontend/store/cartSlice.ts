import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

type cartItem = {
	productId: number;
	name: string;
	price: string;
	image: string;
	quantity: number;
};

// Type for our state
export interface CartState {
	cartState: Array<cartItem>;
}

// Initial state
const initialState: CartState = {
	cartState: [],
};

// Actual Slice
export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		// Action to set the cart status
		setCartState(state, action) {
			state.cartState = action.payload;
		},
		// if the item is already in the cart, increase the quantity
		addToCartState(state, action) {
			const item = { ...action.payload, quantity: 1 };
			const itemIndex = state.cartState.findIndex(
				cartItem => cartItem.productId === item.productId
			);
			if (itemIndex >= 0) {
				state.cartState[itemIndex].quantity++;
			} else {
				state.cartState.push(item);
			}
		},
		// Action to remove an item from the cart
		removeFromCartState(state, action) {
			const itemIndex = state.cartState.findIndex(
				cartItem => cartItem.productId === action.payload
			);
			if (itemIndex >= 0) {
				state.cartState.splice(itemIndex, 1);
			}
		},
		// Action to decrease the quantity of an item in the cart
		decreaseQuantity(state, action) {
			const itemIndex = state.cartState.findIndex(
				cartItem => cartItem.productId === action.payload
			);
			if (itemIndex >= 0) {
				let count = state.cartState[itemIndex].quantity;
				if (count > 1) {
					state.cartState[itemIndex].quantity = count - 1;
				} else {
					state.cartState.splice(itemIndex, 1);
				}
			}
		},
		// Action to reset the cart
		resetCartState(state) {
			state.cartState = [];
		},
	},
	// Special reducer for hydrating the state. Special case for next-redux-wrapper
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.cart,
			};
		},
	},
});

export const {
	setCartState,
	addToCartState,
	removeFromCartState,
	decreaseQuantity,
	resetCartState,
} = cartSlice.actions;

export const selectCartState = (state: AppState) => state.cart.cartState;

export default cartSlice.reducer;
