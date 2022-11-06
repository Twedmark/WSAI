import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./Product.module.css";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { addToCartState, selectCartState } from "../../store/cartSlice";
import React from "react";
import { selectAuthState } from "../../store/authSlice";
import ProductList from "../../components/productList/ProductList";

type ProductProps = {
	productId: number;
	name: string;
	price: number;
	description: string;
	images: string;
};

const Product: FC<ProductProps> = ({
	productId,
	name,
	price,
	description,
	images,
}) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const cart = useSelector(selectCartState);
	const user = useSelector(selectAuthState);
	// const { productId } = router.query;
	const imageArray = images.split(",");

	function addToCart() {
		dispatch(addToCartState({ productId, name, price, image: imageArray[0] }));
	}

	async function editProduct() {
		router.push("/admin/editProduct/" + productId);
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

			router.push("/");
		}
	}

	return (
		<div>
			<main className={styles.main}>
				<div className={styles.imageContainer}>
					{imageArray?.map((image, index) => {
						return <img src={image} alt="product" key={index} />;
					})}
				</div>
				<div className={styles.infoScrollContainer}>
					<div className={styles.infoContainer}>
						<h1 className={styles.title}>{name}</h1>
						<div className={styles.description}>{parse(description)}</div>
						<h2>{price}</h2>
						<button onClick={addToCart} className={styles.addToCartBtn}>
							{cart.find(item => item.productId === productId)
								? "Added to cart"
								: "Add to cart"}
						</button>
						{user?.roles?.includes("Admin") && (
							<>
								<button onClick={editProduct} className={styles.editBtn}>
									Edit
								</button>
								<button onClick={deleteProduct} className={styles.deleteBtn}>
									Delete
								</button>
							</>
						)}
					</div>
				</div>
			</main>
			<h2>Related products</h2>
			<ProductList />
			<ProductList />
		</div>
	);
};

export default Product;

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const productId = context.params?.id;
	const product = await fetch(
		`http://localhost:4000/getProductById/${productId}`
	);
	const data = await product.json();

	if (data.length === 0) {
		return {
			redirect: {
				destination: "/product404",
				permanent: false,
			},
		};
	}

	return {
		props: data[0],
	};
};
