const initialState = {
	cart: [],
};

const cartReducer = (state = initialState, action) => {
	let addedQuantity = false;

	switch (action.type) {
		case "ADD_CART_ITEM":
			const addArray = state.cart.filter(thisCartItem => {
				if (thisCartItem.id === action.payload.id) {
					thisCartItem.quantity++;
					addedQuantity = true;
					return thisCartItem;
				} else {
					return thisCartItem;
				}
			});
			if (addedQuantity) {
				return {
					...state,
					cart: addArray,
				};
			} else {
				return {
					...state,
					cart: [
						...state.cart,
						{
							id: action.payload.id,
							quantity: 1,
							cartItem: action.payload,
						},
					],
				};
			}

		case "REMOVE_CART_ITEM":
			const removeArray = state.cart.filter(thisCartItem => {
				if (thisCartItem.id === action.payload.id) {
					thisCartItem.quantity--;
					if (thisCartItem.quantity > 0) {
						return thisCartItem;
					}
				} else {
					return thisCartItem;
				}
			});
			return {
				...state,
				cart: removeArray,
			};

		case "RESET_CART":
			return initialState;

		default:
			return state;
	}
};

export default cartReducer;
