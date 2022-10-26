import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";

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

type Product = {};

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
	const imageArray = images.split(",");

	function addToCart() {
		console.log("add to cart");
	}

	return (
		<div>
			<article
				className={largeVersion ? styles.largeCard : styles.card}
				onClick={() => {
					router.push(`/product/${productId}`);
				}}
			>
				<div className={styles.imageContainer}>
					{imageArray?.map((image, index) => {
						return <img src={image} alt="product" key={index} />;
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
						>
							<Image src="/shoppingBag.png" width={25} height={25} />
						</button>
					</div>
				</div>
			</article>
		</div>
	);
};

export default ProductCard;
