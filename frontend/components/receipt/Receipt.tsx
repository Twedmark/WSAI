import React, { FC, useState } from "react";
import styles from "./receipt.module.css";

type Props = {
	receipt: {
		receiptId: number;
		userId: number;
		products: any;
		totalPrice: number;
		createdAt: Date;
	};
};

export const Receipt: FC<Props> = ({
	receipt: { receiptId, userId, products, totalPrice, createdAt },
}) => {
	const [isOpened, setIsOpened] = useState(false);
	let options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	let artNumbers = [];

	async function toggleReceipt() {
		// console.log(products);
		artNumbers = products.map((product: object) => {
			// console.log(Object.keys(product));
			artNumbers += Object.keys(product);
		});
		console.log(artNumbers);
		// const response = await fetch("http://localhost:4000/getMultipleReceipt", {
		// 	method: "POST",
		// 	credentials: "include",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		receiptId: receiptId,
		// 	}),
		// });
		// const data = await response.json();
		// console.log(data);

		setIsOpened(!isOpened);
		console.log(isOpened);
	}

	return (
		<li onClick={toggleReceipt}>
			<div className={styles.receiptContainer}>
				<div className={styles.receiptHeader}>
					<p className={styles.receiptId}>Ordernummer: {receiptId}</p>
					<p className={styles.date}>
						Datum: {new Date(createdAt).toLocaleDateString("sv-SE", options)}
					</p>
				</div>
				{isOpened ? <p>Hej</p> : null}

				<div className={styles.receiptBody}>
					<div className={styles.receiptProducts}>
						{products.map((product: any, index: number) => {
							return (
								<section
									key={index}
									className={styles.productAndQuantitySection}
								>
									<p className={styles.productId}>
										Art Nr: {Object.keys(product)}
									</p>
									<p className={styles.productQuantity}>
										{Object.values(product)} st
									</p>
								</section>
							);
						})}
					</div>
					<section className={styles.priceSection}>
						<p className={styles.totalPrice}>
							Total Pris:{" "}
							{String(totalPrice).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")}
							{" SEK"}
						</p>
					</section>
				</div>
			</div>
		</li>
	);
};

export default Receipt;
