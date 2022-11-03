import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setAuthState } from "../../store/authSlice";
import Cart from "../cart/Cart";

import styles from "./Navbar.module.css";

const Navbar = () => {
	const router = useRouter();

	const user = useSelector(selectAuthState);
	const dispatch = useDispatch();

	const determineActive = (path: string) => {
		//console.log(router);
		return router.pathname === path ? styles.active : "";
	};

	async function logout() {
		const response = await fetch("http://localhost:4000/logout", {
			method: "GET",
			credentials: "include",
		});
		if (response.status === 200) {
			dispatch(setAuthState({}));
		}
	}

	return (
		<div className={styles.navbar}>
			<div className={styles.navbarLeft}>
				{/* <Link href="/product/1">
					<a>Product</a>
				</Link> */}
				<Link href="/admin/users">
					<a className={determineActive("/admin/users")}>Users</a>
				</Link>
			</div>

			<div className={styles.navbarCenter}>
				<Link href="/">
					<a className={determineActive("/")}>Home</a>
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
