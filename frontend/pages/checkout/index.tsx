import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { resetCartState, selectCartState } from "../../store/cartSlice";
import CartItem from "../../components/cart/CartItem";
import styles from "./checkout.module.css";
import React, { useEffect, useState } from "react";

const checkout: NextPage = () => {
	const [orderNumber, setOrderNumber] = useState<number>();
	const cartState = useSelector(selectCartState);
	const dispatch = useDispatch();
	let totalPrice = 0,
		thisPrice = "";

	let products = [];

	const listItems = cartState.map(
		(item, index) => (
			products.push({ [item.productId]: item.quantity } as never),
			(thisPrice = item.price.replace(/\s/g, "")),
			(totalPrice = totalPrice + parseInt(thisPrice) * item.quantity),
			(<CartItem key={item.productId} item={item} />)
		)
	);

	let receipt = { products: products, totalPrice: totalPrice };

	let priceString = String(totalPrice).replace(
		/(\d)(?=(\d{3})+(?!\d))/g,
		"$1 "
	);

	async function completeOrder() {
		const response = await fetch("http://localhost:4000/addReceipt", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(receipt),
		});
		const data = await response.json();
		if (data.message === "Receipt added") {
			dispatch(resetCartState());

			setOrderNumber(data.id);
		}
	}

	return (
		<div>
			{cartState.length > 0 ? (
				<>
					{orderNumber ? (
						<div className={styles.checkedOut}>
							<h1>Thank you for your order!</h1>
							<p>Your order number is {orderNumber}</p>
						</div>
					) : (
						<div className={styles.checkout}>
							<div className={styles.header}>
								<h1>Här är din varukorg</h1>
							</div>
							<section className={styles.receiptContainer}>
								<ul className={styles.productList}>{listItems}</ul>
								<p>Totalt: {priceString} SEK</p>
							</section>

							<button className={styles.checkoutButton} onClick={completeOrder}>
								Bekräfta beställning
							</button>
						</div>
					)}
				</>
			) : (
				<div className={styles.emptyCart} style={{ textAlign: "center" }}>
					<h1>Din varukorg är tom</h1>
					<p>Gå och handla lite!</p>
				</div>
			)}
		</div>
	);
};

export default checkout;
