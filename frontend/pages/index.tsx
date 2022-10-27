import type { NextPage } from "next";
import Head from "next/head";
import ProductList from "../components/productList/ProductList";

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>WSAI</title>
				<meta name="description" content="Created by JKL & ATW" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<ProductList largeVersion />
				<ProductList />
			</main>
		</div>
	);
};

export default Home;
