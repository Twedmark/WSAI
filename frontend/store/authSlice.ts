import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

type user = {
	userId: number;
	email: string;
	roles: string[];
	token: string;
	isLoading: boolean;
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
		setAuthLoading(state, action) {
			state.authState.isLoading = action.payload;
		},
		clearAuthState(state) {
			state.authState = { isLoading: false } as user;
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

export const { setAuthState, setAuthLoading, clearAuthState } =
	authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;

export default authSlice.reducer;
