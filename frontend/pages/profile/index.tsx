import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";

type UserReceipts = {
	receiptId: number;
	userId: number;
	products: any;
	createdAt: string;
};

const Profile: NextPage = () => {
	const [Receipts, setReceipts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					"http://localhost:4000/getReceiptFromUser",
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (response.status === 200) {
					let data = await response.json();
					data = data.map((receipt: UserReceipts) => {
						receipt.products = JSON.parse(receipt.products);
						return receipt;
					});
					console.log(data);
					setReceipts(data);
				}
			} catch (err) {
				alert(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	async function fetchProducts(productId) {
		const response = await fetch(
			`http://localhost:4000/getProductById/${productId}`
		);
		if (response.status === 200) {
			let data = await response.json();
			console.log(data);
			return data;
		}
	}

	return (
		<div>
			<h1>Profile</h1>
			<ul>
				{Receipts.map((receipt: UserReceipts) => (
					<li key={receipt.receiptId}>
						<div>
							<p className={styles.receiptId}>
								Order Nummer: {receipt.receiptId}
							</p>
							{receipt.products.map((product: any, index) => {
								return (
									<section
										key={index}
										className={styles.productAndQuantitySection}
									>
										<p className={styles.product}>
											Artikel Nummer: {Object.keys(product)}
										</p>
										<p className={styles.Quantity}>
											Antal: {Object.values(product)}
										</p>
									</section>
								);
							})}
							<p className={orderDate}>
								Datum för beställning: {receipt.createdAt}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Profile;
