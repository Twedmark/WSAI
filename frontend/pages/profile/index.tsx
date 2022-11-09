import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Receipt from "../../components/receipt/Receipt";

type UserReceipts = {
	receiptId: number;
	userId: number;
	products: any;
	totalPrice: number;
	createdAt: Date;
};

const Profile: NextPage = () => {
	const [Receipts, setReceipts] = useState([]),
		[loading, setLoading] = useState(false),
		[error, setError] = useState(false);

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
			<h1 className={styles.profileTitle}>Profile</h1>
			<ul className={styles.receiptUl}>
				{Receipts.length === 0 ? (
					<p className={styles.emptyReceipts}>
						Här kommer din kvitton att synas efter du handlat hos oss
					</p>
				) : (
					Receipts.map((receipt: UserReceipts, index) => (
						<Receipt key={receipt.receiptId} receipt={receipt} />
					))
				)}
			</ul>
		</div>
	);
};

export default Profile;
