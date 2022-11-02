import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { selectCartState } from "../../store/cartSlice";
import CartItem from "../../components/cart/CartItem";

const checkout: NextPage = () => {
	const cartState = useSelector(selectCartState);

	return (
		<div>
			<h2>Här är din varukorg</h2>
			<ul>
				{cartState.map(item => (
					<CartItem key={item.productId} item={item} />
				))}
			</ul>
		</div>
	);
};

export default checkout;
