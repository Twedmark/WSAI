import { useRouter } from "next/router";
import { FC } from "react";
import { useDispatch } from "react-redux";
import {
	addToCartState,
	removeFromCartState,
	decreaseQuantity,
} from "../../store/cartSlice";

import styles from "./CartItem.module.css";

type props = {
	item: {
		productId: number;
		name: string;
		price: string;
		image: string;
		quantity: number;
	};
};

const CartItem: FC<props> = ({
	item: { productId, name, price, image, quantity },
}) => {
	const dispatch = useDispatch();
	const router = useRouter();

	function routeToProduct() {
		router.push(`/product/${productId}`);
	}

	function increaseQuantity() {
		dispatch(addToCartState({ productId, name, price, image }));
	}

	function decreaseQuantityFunc() {
		dispatch(decreaseQuantity(productId));
	}

	function removeFromCart() {
		dispatch(removeFromCartState(productId));
	}

	return (
		<li className={styles.cartItem}>
			<div className={styles.imageContainer}>
				<img onClick={routeToProduct} src={image} />
			</div>
			<div className={styles.infoContainer}>
				<h4 onClick={routeToProduct}>{name}</h4>
				<p>Price: {price}</p>

				<div className={styles.quantityPill}>
					<button
						className={styles.quantityMinus}
						onClick={decreaseQuantityFunc}
					>
						-
					</button>
					<p>{quantity}</p>
					<button className={styles.quantityPlus} onClick={increaseQuantity}>
						+
					</button>
				</div>

				<button className={styles.button} onClick={removeFromCart}>
					X
				</button>
			</div>
		</li>
	);
};

export default CartItem;
