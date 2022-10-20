import React from "react";

import styles from "./Navbar.module.css";

const Navbar = () => {
	return (
		<div className={styles.navbar}>
			<div className={styles.navbarLinks}>
				<a href="/">Home</a>
				<a href="/login">Login</a>
			</div>
		</div>
	);
};

export default Navbar;
