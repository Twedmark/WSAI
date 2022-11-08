import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { selectCartState } from "../../store/cartSlice";
import CartItem from "../../components/cart/CartItem";
import styles from "./checkout.module.css";
import React from "react";

const checkout: NextPage = () => {
	const cartState = useSelector(selectCartState);
	let totalPrice = 0,
		thisPrice = "";

	let products = [];

	const listItems = cartState.map(
		(item, index) => (
			products.push({ [item.productId]: item.quantity }),
			(thisPrice = item.price.replace(/\s/g, "")),
			(totalPrice = totalPrice + parseInt(thisPrice) * item.quantity),
			(<CartItem key={item.productId} item={item} />)
		)
	);

	let receipt = { products: products, totalPrice: totalPrice };
	console.log(receipt);

	let priceString = String(totalPrice).replace(
		/(\d)(?=(\d{3})+(?!\d))/g,
		"$1 "
	);

	console.log(cartState);

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
		console.log(data);
	}

	return (
		<div>
			<div className={styles.header}>
				<h1>Här är din varukorg</h1>
			</div>
			<section className={styles.receiptContainer}>
				<ul>{listItems}</ul>
				<p>Totalt: {priceString} SEK</p>
			</section>

			<button className={styles.checkoutButton} onClick={completeOrder}>
				KÖP
			</button>
		</div>
	);
};

export default checkout;
