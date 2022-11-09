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

	const christmasVideo = (
		<section className={styles.videoBlock} key="christmasVideo">
			<div className={styles.videoContainer}>
				<video
					className={styles.video + " zoom-to-fill"}
					autoPlay
					loop
					muted
					src="https://a.storyblok.com/f/118230/x/7cc86faac7/artilleriet-christmas-22-start-header-video.mp4"
				></video>
			</div>
			<div className={styles.contentBlock}>
				<div className={styles.contentContent}>
					<h2>Artilleriet Christmas 2022</h2>
				</div>
			</div>
		</section>
	);

	//store variable that shows as many product lists as productListCount
	const productLists = [] as any;
	for (let i = 0; i < productListCount; i++) {
		if (i % 2 === 0) {
			productLists.push(<ProductList key={i} largeVersion />); // make every other one large
		} else {
			productLists.push(<ProductList key={i} />);
		}

		if (i === 1) {
			productLists.push(christmasVideo);
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
