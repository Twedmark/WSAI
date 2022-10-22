import { FC, useState } from "react";
import styles from "./Cart.module.css";

const Cart: FC = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [openedEver, setOpenedEver] = useState(false);

	function toggleCart() {
		console.log("toggle cart");
		setCartOpen(!cartOpen);
		setOpenedEver(true);
	}
	return (
		<div className={styles.cartContainer}>
			<p onClick={toggleCart}>Cart</p>
			<div
				className={
					cartOpen
						? `${styles.cart} ${styles.cartOpened}`
						: `${styles.cart} ${styles.cartClosed} ${
								!openedEver ? styles.notOpenedEver : "" // stop it from doing "closing animation" on first render
						  }`
				}
			>
				<h1>Cart</h1>
				<h2>asd</h2>
				<h2>asd</h2>
				<h2>asd</h2>
				<h2>asd</h2>
				<h2>asd</h2>
			</div>
		</div>
	);
};

export default Cart;
