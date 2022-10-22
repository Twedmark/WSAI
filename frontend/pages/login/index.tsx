import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import styles from "../../styles/Login.module.css";

const Login: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [user, setUser] = useState(null);

	async function login() {
		console.log(email, password);
		const response = await fetch("http://localhost:4000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		const data = await response.json();

		if(response.status === 200) {
			console.log("loggedIn OK", data);
			setUser(data);
		} else {
			alert(data.message);
		}

	}

	return (
		<div>
			{user ? (
				<h1>Du är redan inloggad!</h1>
			) : (
				<main className={styles.main}>
					<Navbar />
					<div className={styles.grid}>
						<h1 className={styles.title}>Login</h1>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="text"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button onClick={login}>Login</button>
						<Link href="/register">Don't have an account?</Link>
					</div>
				</main>
			)}
		</div>
	);
};

export default Login;
