import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";

import { addToCartState, selectCartState } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";
import React from "react";

type Props = {
	product: {
		productId: number;
		name: string;
		price: string;
		description: string;
		material: string;
		dimensions: string;
		specification: string;
		images: string;
	};
	largeVersion?: boolean;
};

export const ProductCard: FC<Props> = ({
	product: {
		productId,
		name,
		price,
		description,
		material,
		dimensions,
		specification,
		images,
	},
	largeVersion = false,
}) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const imageArray = images.split(",");

	const user = useSelector(selectAuthState);
	const cart = useSelector(selectCartState);

	function addToCart() {
		dispatch(addToCartState({ productId, name, price, image: imageArray[0] }));
	}

	async function deleteProduct() {
		if (confirm("Are you sure you want to delete this product?")) {
			let url = "http://localhost:4000/deleteProduct/" + productId;
			const reponse = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const data = await reponse.json();
			alert(data.message);

			router.reload();
		}
	}

	return (
		<article
			className={largeVersion ? styles.largeCard : styles.card}
			onClick={() => {
				router.push(`/product/${productId}`);
			}}
			onKeyDown={e => {
				if (e.key === "Enter" || e.key === " ") {
					router.push(`/product/${productId}`);
				}
			}}
			tabIndex={0}
		>
			{user?.roles?.includes("Admin") && (
				<button
					className={styles.deleteArticle}
					onClick={e => {
						e.stopPropagation();
						deleteProduct();
					}}
				>
					X
				</button>
			)}
			<div className={styles.imageContainer}>
				{imageArray
					?.slice(0)
					.reverse()
					.map((image, index) => {
						return (
							<img
								className={imageArray.length >= 2 ? styles.opacityHover : ""}
								src={image}
								alt="product"
								key={index}
							/>
						);
					})}
			</div>
			<div className={styles.infoContainer}>
				<h1 className={styles.title}>{name}</h1>
				<div>
					<h2>{price}</h2>
					<button
						onClick={e => {
							e.stopPropagation();
							addToCart();
						}}
						onKeyDown={e => {
							//stop it from triggering the parent onClick
							e.stopPropagation();
							//dont do add to cart explicitly, since this apparently triggers the onClick, thus still adding to cart
						}}
						className={
							cart.filter(cartItem => cartItem.productId === productId).length >
							0
								? `${styles.addToCart} ${styles.addedToCart}`
								: styles.addToCart
						}
					>
						{cart.filter(cartItem => cartItem.productId === productId).length >
						0 ? (
							<p
								style={{
									height: "20px",
									width: "20px",
									margin: "0",
									textAlign: "center",
									lineHeight: "20px",
								}}
							>
								+1
							</p>
						) : (
							<Image src="/shoppingBag.png" width={20} height={20} />
						)}
					</button>
				</div>
			</div>
		</article>
	);
};

export default ProductCard;
