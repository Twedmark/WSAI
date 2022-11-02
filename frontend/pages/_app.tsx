import "../styles/globals.css";

import Navbar from "../components/navbar/Navbar";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import { useEffect } from "react";

import {
	selectAuthState,
	setAuthLoading,
	setAuthState,
} from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCartState, setCartState } from "../store/cartSlice";

function MyApp({ Component, pageProps }: AppProps) {
	const dispatch = useDispatch();
	const cart = useSelector(selectCartState);
	const user = useSelector(selectAuthState);

	useEffect(() => {
		async function loginWithToken() {
			const response = await fetch("http://localhost:4000/loginWithToken", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				dispatch(setAuthState(data));
				dispatch(setAuthLoading(false));
			} else {
				dispatch(setAuthLoading(false));
			}
		}

		loginWithToken();
	}, []);

	useEffect(() => {
		let localStorageCart = localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart") as string)
			: [];
		console.log("getting", localStorageCart);

		dispatch(setCartState(localStorageCart));
	}, []);

	useEffect(() => {
		if (user.isLoading === false) {
			console.log("setting", cart);
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	}, [cart]);

	return (
		<>
			<Navbar />
			<Component {...pageProps} />
		</>
	);
}

export default wrapper.withRedux(MyApp);
