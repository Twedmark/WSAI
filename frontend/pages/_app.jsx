import "../styles/globals.css";

import Navbar from "../components/navbar/Navbar";
import { createStore } from "redux";
import { Provider } from "react-redux";
import cartReducer from "../reducers/cartReducer";

const persistedState = localStorage.getItem("WSAICart")
	? JSON.parse(localStorage.getItem("WSAICart"))
	: { cart: [] };

const store = createStore(
	cartReducer,
	persistedState,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
	localStorage.setItem("WSAICart", JSON.stringify(store.getState()));
});

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Provider store={store}>
				<Navbar />
				<Component {...pageProps} />
			</Provider>
		</>
	);
}

export default MyApp;
