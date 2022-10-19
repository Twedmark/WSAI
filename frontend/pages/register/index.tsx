import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

const Register: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");

	async function register() {
		console.log(email, password);
		const response = await fetch("http://localhost:4000/createUser", {
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

		console.log(data);
	}

	return (
		<div>
			<main className={styles.main}>
				<div className={styles.grid}>
					<h1 className={styles.title}>Register</h1>
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
					<label htmlFor="passwordRepeat">Repeat Password</label>
					<input
						id="passwordRepeat"
						type="password"
						value={passwordRepeat}
						onChange={e => setPasswordRepeat(e.target.value)}
					/>

					<button onClick={register}>Register</button>
					<Link href="/login">Already have an account?</Link>
				</div>
			</main>
		</div>
	);
};

export default Register;
