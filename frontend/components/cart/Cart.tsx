import Image from "next/image";
import { FC, useState } from "react";
import styles from "./Cart.module.css";

import { selectCartState, addToCartState } from "../../store/cartSlice";
import { useSelector } from "react-redux";

import CartItem from "./CartItem";

const Cart: FC = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [openedEver, setOpenedEver] = useState(false);

	const cartState = useSelector(selectCartState);

	console.log(cartState);

	function toggleCart() {
		console.log("toggle cart");
		setCartOpen(!cartOpen);
		setOpenedEver(true);
	}

	return (
		<div className={styles.cartContainer}>
			<p onClick={toggleCart} style={{ cursor: "pointer" }}>
				<Image src="/shoppingBag.png" width={25} height={25} />{" "}
			</p>
			{cartOpen ? (
				<div
					className={`${styles.cartBackground} ${styles.cartBackgroundOpen}`}
					onClick={toggleCart}
					onMouseOver={toggleCart}
				></div>
			) : (
				<div
					className={`${styles.cartBackground} ${styles.cartBackgroundClose}`}
				></div>
			)}
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
				{cartState.length === 0 ? (
					<p>Cart is empty</p>
				) : (
					<ul>
						{cartState.map(item => (
							<CartItem key={item.productId} item={item} />
						))}
					</ul>
				)}

				<button className={styles.checkout}>Checkout</button>
			</div>
		</div>
	);
};

export default Cart;
