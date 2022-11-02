import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface CartState {
	cartState: Array<string>;
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

export const { setCartState } = cartSlice.actions;

export const selectCartState = (state: AppState) => state.cart.cartState;

export default cartSlice.reducer;
