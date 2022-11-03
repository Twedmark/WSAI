import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { json } from "stream/consumers";

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
					// JSON parse all products in data again.products and add it back to data
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

	return (
		<div>
			<h1>Profile</h1>
			<ul>
				{Receipts.map((receipt: UserReceipts) => (
					<li key={receipt.receiptId}>
						<p>Order Nummer: {receipt.receiptId}</p>
						<p>produkt: {receipt.products[0]}</p>
						<p>Datum för beställning: {receipt.createdAt}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Profile;
