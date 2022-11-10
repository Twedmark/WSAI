import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import styles from "../login/Login.module.css";

const Register: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");
	const router = useRouter();

	async function register(e) {
		e.preventDefault();
		if (password != passwordRepeat) {
			alert("The two passwords must be the same!");
			return;
		}
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

		if (response.status === 429) {
			alert(
				"You have reached the maximum number of requests per minute. Please try again later."
			);
			return;
		}

		const data = await response.json();
		if (data.message === "User already exists") {
			if (confirm("User already exists. Do you want to go to login instead?")) {
				router.push("/login");
			}
			return;
		}
		if (data.message) {
			alert(data.message);
			return;
		}
		alert("User created successfully!");
		router.push("/login");
	}

	return (
		<div>
			<main className={styles.main}>
				<form className={styles.grid} onSubmit={register}>
					<h1 className={styles.title}>Register</h1>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
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
						autoComplete="new-password"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
						title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
					/>
					<label htmlFor="passwordRepeat">Repeat Password</label>
					<input
						id="passwordRepeat"
						type="password"
						value={passwordRepeat}
						onChange={e => setPasswordRepeat(e.target.value)}
						required
						autoComplete="new-password"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
						title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
					/>

					<button type="submit">Register</button>
					<Link href="/login">Already have an account?</Link>
				</form>
			</main>
		</div>
	);
};

export default Register;
