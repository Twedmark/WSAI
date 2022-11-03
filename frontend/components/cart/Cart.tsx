import Image from "next/image";
import { FC, useEffect, useState } from "react";
import styles from "./Cart.module.css";

import { selectCartState, addToCartState } from "../../store/cartSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import CartItem from "./CartItem";

const Cart: FC = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [openedEver, setOpenedEver] = useState(false);
	let totalPrice = 0,
		thisPrice = "";

	const cartState = useSelector(selectCartState);
	const router = useRouter();

	const listItems = cartState.map(
		(item, index) => (
			(thisPrice = item.price.replace(/\s/g, "")),
			(totalPrice = totalPrice + parseInt(thisPrice) * item.quantity),
			(<CartItem key={item.productId} item={item} />)
		)
	);

	let priceString = String(totalPrice).replace(
		/(\d)(?=(\d{3})+(?!\d))/g,
		"$1 "
	);

	function toggleCart() {
		setCartOpen(!cartOpen);
		setOpenedEver(true);
	}
	function checkout() {
		router.push("/checkout");
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
					<p>Your cart is empty :(</p>
				) : (
					<ul>
						{cartState.map(
							item => (
								(thisPrice = item.price.replace(/\s/g, "")),
								(totalPrice = totalPrice + parseInt(thisPrice) * item.quantity),
								(<CartItem key={item.productId} item={item} />)
							)
						)}
					</ul>
				)}
				{cartState.length > 0 && (
					<div>
						<p>{priceString} SEK</p>
						<button className={styles.checkout} onClick={checkout}>
							Gå till kassan
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
