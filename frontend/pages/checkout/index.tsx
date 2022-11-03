import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { selectCartState } from "../../store/cartSlice";
import CartItem from "../../components/cart/CartItem";
import styles from "./checkout.module.css";

const checkout: NextPage = () => {
	const cartState = useSelector(selectCartState);
	let totalPrice = 0,
		thisPrice = "";

	const listItems = cartState.map(
		(item, index) => (
			(thisPrice = item.price.replace(/\s/g, "")),
			(totalPrice = totalPrice + parseInt(thisPrice) * item.quantity),
			(<CartItem key={item.productId} item={item} />)
		)
	);

	return (
		<div>
			<h2>Här är din varukorg</h2>
			<section className={styles.receiptContainer}>
				<ul>{listItems}</ul>
			</section>
		</div>
	);
};

export default checkout;
