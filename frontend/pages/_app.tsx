import "../styles/globals.css";

import Navbar from "../components/navbar/Navbar";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import { useEffect } from "react";

import { setAuthState } from "../store/authSlice";
import { useDispatch } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
	const dispatch = useDispatch();
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
			}
		}

		loginWithToken();
	}, []);

	return (
		<>
			<Navbar />
			<Component {...pageProps} />
		</>
	);
}

export default wrapper.withRedux(MyApp);
