import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectAuthState,
	setAuthLoading,
	setAuthState,
} from "../../store/authSlice";
import styles from "./Login.module.css";

const Login: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const router = useRouter();

	const user = useSelector(selectAuthState);

	async function login(e: any) {
		e.preventDefault();
		const response = await fetch("http://localhost:4000/login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		if (response.status === 429) {
			alert(
				"You have reached the maximum number of requests per minute. Please try again later."
			);
			return;
		}

		const data = await response.json();

		if (response.status === 200) {
			dispatch(setAuthState(data));
			dispatch(setAuthLoading(false));
			router.push("/");
		} else {
			alert(data.message);
			dispatch(setAuthLoading(false));
		}
	}

	return (
		<div>
			{user.email ? (
				<>
					<h1>Du är redan inloggad!</h1>
					<Link href="/profile">
						<a>Go to profile</a>
					</Link>
				</>
			) : (
				<main className={styles.main}>
					<form className={styles.grid} onSubmit={login}>
						<h1 className={styles.title}>Login</h1>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="text"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<button type="submit">Login</button>
						<Link href="/register">Don't have an account?</Link>
					</form>
				</main>
			)}
		</div>
	);
};

export default Login;
