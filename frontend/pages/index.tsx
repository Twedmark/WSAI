import type { NextPage } from "next";
import styles from "./index.module.css";
import Head from "next/head";
import ProductList from "../components/productList/ProductList";
import React from "react";

const Home: NextPage = () => {
	const [productListCount, setProductListCount] = React.useState(0);

	function increaseProductLists() {
		setProductListCount(productListCount + 2);
	}

	//store variable that shows as many product lists as productListCount
	const productLists = [] as any;
	for (let i = 0; i < productListCount; i++) {
		if (i % 2 === 0) {
			productLists.push(<ProductList key={i} largeVersion />); // make every other one large
		} else {
			productLists.push(<ProductList key={i} />);
		}
	}

	return (
		<div>
			<Head>
				<title>WSAI</title>
				<meta name="description" content="Created by JKL & ATW" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div className={styles.videoBlock}>
					<div className={styles.videoContainer}>
						<video
							className={styles.video + " zoom-to-fill"}
							autoPlay
							loop
							muted
							src="https://a.storyblok.com/f/118230/x/58568c8237/kitchen_studio_header_video_v3.mp4"
						></video>
						<p className={styles.downArrow}>⬇</p>
					</div>
				</div>
				<div className={styles.productListContainer}>
					<ProductList largeVersion />
					<ProductList />

					{productLists}

					<div className={styles.loadMoreContainer}>
						<button className={styles.loadMore} onClick={increaseProductLists}>
							Load More
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
