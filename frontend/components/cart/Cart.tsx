import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./Cart.module.css";

import { selectCartState, addToCartState } from "../../store/cartSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import CartItem from "./CartItem";

const Cart: FC = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [openedEver, setOpenedEver] = useState(false);
	const cartCountRef = useRef<HTMLDivElement>(null);
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

	// store a number variable with all items in cartState quantity
	const totalItems = cartState.reduce((acc, item) => acc + item.quantity, 0);

	useEffect(() => {
		cartCountRef.current?.classList.add(styles.cartCountAnimation);
		setTimeout(() => {
			cartCountRef.current?.classList.remove(styles.cartCountAnimation);
		}, 500);
	}, [totalItems]);

	return (
		<div className={styles.cartContainer}>
			<div
				onClick={toggleCart}
				style={{ cursor: "pointer", position: "relative" }}
			>
				<Image src="/shoppingBag.png" width={25} height={25} />{" "}
				<span className={styles.cartCount} ref={cartCountRef}>
					{totalItems}
				</span>
			</div>
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
