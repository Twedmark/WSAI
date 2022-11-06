import type { NextPage } from "next";
import styles from "./index.module.css";
import Head from "next/head";
import ProductList from "../components/productList/ProductList";
import React from "react";

const Home: NextPage = () => {
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
						<p className={styles.downArrow}>🡳</p>
					</div>
				</div>
				<div className={styles.productListContainer}>
					<ProductList largeVersion />
					<ProductList />
				</div>
			</main>
		</div>
	);
};

export default Home;
