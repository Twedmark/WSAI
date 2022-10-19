import type { NextPage } from "next";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

const Login: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function login() {
		console.log(email, password);
	}

	return (
		<div>
			<main className={styles.main}>
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
				</div>
			</main>
		</div>
	);
};

export default Login;
