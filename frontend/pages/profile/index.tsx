import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";

type UserReceipts = {
	receiptId: number;
	userId: number;
	products: any;
	totalPrice: number;
	createdAt: Date;
};

const Profile: NextPage = () => {
	const [Receipts, setReceipts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	let options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};

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
			<h1 className={styles.profileTitle}>Profile</h1>
			<ul className={styles.receiptUl}>
				{Receipts.map((receipt: UserReceipts) => (
					<li key={receipt.receiptId}>
						<div className={styles.receiptContainer}>
							<div className={styles.receiptHeader}>
								<p className={styles.receiptId}>
									Ordernummer: {receipt.receiptId}
								</p>
								<p className={styles.date}>
									Datum:{" "}
									{new Date(receipt.createdAt).toLocaleDateString(
										"sv-SE",
										options
									)}
								</p>
							</div>
							<div className={styles.receiptBody}>
								<div className={styles.receiptProducts}>
									{receipt.products.map((product: any, index) => {
										return (
											<section
												key={index}
												className={styles.productAndQuantitySection}
											>
												<p className={styles.productId}>
													Art: {Object.keys(product)}
												</p>
												<p className={styles.productQuantity}>
													Antal: {Object.values(product)}
												</p>
											</section>
										);
									})}
								</div>
								<section className={styles.priceSection}>
									<p className={styles.totalPrice}>
										Pris: {receipt.totalPrice}
									</p>
								</section>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Profile;
