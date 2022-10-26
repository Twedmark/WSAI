import { useEffect, useState } from "react";
import styles from "./ProductList.module.css";
import ProductCard from "../productCard/ProductCard";

const ProductList = ({ largeVersion = false }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://localhost:4000/getProducts");
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
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>There was an error: {error}</div>;
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
