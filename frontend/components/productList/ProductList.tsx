import React from "react";
import { useEffect, useState } from "react";
import ProductCard from "../productCard/ProductCard";
import styles from "./ProductList.module.css";

const ProductList = ({ largeVersion = false }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					"http://localhost:4000/getRandomProducts/10"
				);
				const data = await response.json();
				setProducts(data);
			} catch (err) {
				alert(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) {
		return (
			<div className={styles.loading}>
				<h1>Loading...</h1>
			</div>
		);
	}

	if (error) {
		return <div className={styles.error}>There was an error: {error}</div>;
	}

	type Product = {
		productId: number;
		name: string;
		price: string;
		description: string;
		material: string;
		dimensions: string;
		specification: string;
		images: string;
	};

	return (
		<div className={styles.container}>
			{products.map((product: Product) => (
				<ProductCard
					key={product.productId}
					product={product}
					largeVersion={largeVersion}
				/>
			))}
		</div>
	);
};

export default ProductList;
