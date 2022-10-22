import Link from "next/link";
import { useRouter } from "next/router";
import Cart from "../cart/Cart";

import styles from "./Navbar.module.css";

const Navbar = () => {
	const router = useRouter();

	const determineActive = (path: string) => {
		return router.pathname === path ? styles.active : "";
	};

	return (
		<div className={styles.navbar}>
			<div className={styles.navbarLeft}>
				<Link href="/product">
					<a className={determineActive("/product")}>Product</a>
				</Link>
			</div>

			<div className={styles.navbarCenter}>
				<Link href="/">
					<a className={determineActive("/")}>Home</a>
				</Link>
			</div>

			<div className={styles.navbarRight}>
				<Link href="/login">
					<a className={determineActive("/login")}>Login</a>
				</Link>
				<Cart />
			</div>
		</div>
	);
};

export default Navbar;
