import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./Product.module.css";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

type ProductProps = {
	name: string;
	price: number;
	description: string;
	material: string;
	dimensions: string;
	specification: string;
	images: string;
};

const Product: FC<ProductProps> = ({
	name,
	price,
	description,
	material,
	dimensions,
	specification,
	images,
}) => {
	const router = useRouter();
	// const { productId } = router.query;

	function addToCart() {
		console.log("add to cart", images);
		console.log("add to cart");
	}

	return (
		<div>
			<main className={styles.main}>
				<div className={styles.imageContainer}>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
				</div>
				<div className={styles.infoScrollContainer}>
					<div className={styles.infoContainer}>
						<h1 className={styles.title}>{name}</h1>
						<p className={styles.description}>{description}</p>
						<h2>{price}</h2>
						<button onClick={addToCart}>Add to cart</button>
					</div>
				</div>
			</main>
			<article className={styles.article}>
				<h1 className={styles.title}>{name}</h1>
				<p className={styles.description}>{description}</p>
			</article>
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
