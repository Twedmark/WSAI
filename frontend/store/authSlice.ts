import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

type user = {
	userId: number;
	email: string;
	roles: string[];
	token: string;
};

// Type for our state
export interface AuthState {
	authState: user;
}

// Initial state
const initialState: AuthState = {
	authState: {} as user,
};

// Actual Slice
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Action to set the auth status
		setAuthState(state, action) {
			state.authState = action.payload;
		},
	},
	// Special reducer for hydrating the state. Special case for next-redux-wrapper
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.auth,
			};
		},
	},
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer;
