import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState, selectAuthState } from "../../store/authSlice";
import Cart from "../cart/Cart";

import styles from "./Navbar.module.css";

const Navbar = () => {
	const router = useRouter();

	const user = useSelector(selectAuthState);
	const dispatch = useDispatch();

	const determineActive = (path: string) => {
		return router.pathname === path ? styles.active : "";
	};

	async function logout() {
		const response = await fetch("http://localhost:4000/logout", {
			method: "GET",
			credentials: "include",
		});
		if (response.status === 200) {
			dispatch(clearAuthState());
			router.push("/");
		}
	}

	return (
		<div className={styles.navbar}>
			<div className={styles.navbarLeft}>
				{user?.roles?.includes("SuperAdmin") && (
					<Link href="/admin/users">
						<a className={determineActive("/admin/users")}>Users</a>
					</Link>
				)}
				{user?.roles?.includes("Admin") && (
					<Link href="/admin/addProduct">
						<a className={determineActive("/admin/addProduct")}>addProduct</a>
					</Link>
				)}
			</div>

			<div className={styles.navbarCenter}>
				<Link href="/">
					<a className={determineActive("/")}>WSAI</a>
				</Link>
			</div>

			<div className={styles.navbarRight}>
				{user.email ? (
					<>
						<Link href="/profile">
							<a className={determineActive("/profile")}>{user.email}</a>
						</Link>
						<button className={styles.logout} onClick={logout}>
							Logout
						</button>
					</>
				) : (
					<>
						<Link href="/login">
							<a className={determineActive("/login")}>Login</a>
						</Link>
					</>
				)}
				<Cart />
			</div>
		</div>
	);
};

export default Navbar;
