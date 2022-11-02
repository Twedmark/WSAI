import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";

import { addToCartState } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";

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

	function addToCart() {
		dispatch(addToCartState({ productId, name, price, image: imageArray[0] }));
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
					>
						<Image src="/shoppingBag.png" width={25} height={25} />
					</button>
				</div>
			</div>
		</article>
	);
};

export default ProductCard;
