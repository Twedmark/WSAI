const addCartItem = cartItem => {
	return {
		type: "ADD_CART_ITEM",
		payload: cartItem,
	};
};

const removeCartItem = cartItem => {
	return {
		type: "REMOVE_CART_ITEM",
		payload: cartItem,
	};
};
const resetCart = () => {
	return {
		type: "RESET_CART",
	};
};

export { addCartItem, removeCartItem, resetCart };
