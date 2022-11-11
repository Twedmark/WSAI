import { NextPage } from "next";
import React from "react";

import styles from "./studio.module.css";

const studio: NextPage = () => {
	return (
		<>
			<section className={styles.textAndImgContainer}>
				<div className={styles.textArea}>Text Area</div>
				<div className={styles.imageArea}>img</div>
			</section>
			<section className={styles.textAndImgContainer}>
				<div className={styles.imageArea}>img</div>
				<div className={styles.textArea}>Text Area</div>
			</section>
			<section className={styles.textAndImgContainer}>
				<div className={styles.textArea}>Text Area</div>
				<div className={styles.imageArea}>img</div>
			</section>
		</>
	);
};

export default studio;
