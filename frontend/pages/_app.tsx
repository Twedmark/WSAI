import "../styles/globals.css";

import Navbar from "../components/navbar/Navbar";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		async function loginWithToken() {
			const response = await fetch("http://localhost:4000/loginWithToken", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			console.log(data);
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
