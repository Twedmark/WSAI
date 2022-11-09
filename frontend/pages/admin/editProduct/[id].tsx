import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../../store/authSlice";
import styles from "./editProduct.module.css";

import sanitizeHtml from "sanitize-html";

type Props = {
	productId: number;
	name: string;
	price: string;
	description: string;
	material: string;
	dimensions: string;
	specification: string;
	images: string;
};

const editProduct: NextPage<Props> = ({
	productId,
	name,
	price,
	description,
	material,
	dimensions,
	specification,
	images,
}) => {
	const router = useRouter();
	const { id } = router.query;

	const user = useSelector(selectAuthState);

	useEffect(() => {
		if (user.isLoading === false && !user?.roles?.includes("Admin")) {
			router.push("/");
		}
	}, [user.isLoading]);

	const nameInput = useRef<HTMLInputElement>(null);
	const priceInput = useRef<HTMLInputElement>(null);
	const descriptionInput = useRef<HTMLTextAreaElement>(null);
	const imagesInput = useRef<HTMLTextAreaElement>(null);

	const [priceAsNumber, setPriceAsNumber] = useState<number>(0);
	useEffect(() => {
		let priceCopy = "" + price;
		priceCopy = priceCopy.replace("SEK", "");
		priceCopy = priceCopy.replace(/\s/g, "");
		setPriceAsNumber(Number(priceCopy));
	}, []);

	async function save() {
		let priceFormatted = String(priceAsNumber).replace(
			/(\d)(?=(\d{3})+(?!\d))/g,
			"$1 "
		);
		priceFormatted = priceFormatted + " SEK";

		const imagesArray = imagesInput.current?.value.split(",");
		const imagesArrayTrimmed = imagesArray?.map(image =>
			image.replace(/\s/g, "")
		);
		//remove any empty strings
		const imagesArrayTrimmedFiltered = imagesArrayTrimmed?.filter(
			image => image !== ""
		);

		const descriptionClean = sanitizeHtml(descriptionInput.current?.value);

		let url = "http://localhost:4000/editProduct/" + id;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				productId,
				name: nameInput.current?.value,
				price: priceFormatted,
				description: descriptionClean,
				images: imagesArrayTrimmedFiltered?.join(","),
			}),
		});

		const data = await response.json();
		alert(data.message);

		router.push("/product/" + id);
	}

	return (
		<div className={styles.editContainer}>
			<h1>Edit Product</h1>

			<p>Product ID: {productId}</p>

			<p>Product Name: </p>
			<input type="text" defaultValue={name} ref={nameInput} />

			<p>Product Price: </p>
			<input
				type="number"
				value={priceAsNumber}
				onChange={e => {
					setPriceAsNumber(Number(e.target.value));
				}}
				ref={priceInput}
			/>

			<p>Product Description: </p>
			<textarea defaultValue={description} ref={descriptionInput} />

			<p>Product Images: </p>
			<textarea defaultValue={images} ref={imagesInput} />

			<button onClick={save}>Save Changes</button>
		</div>
	);
};

export default editProduct;

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const productId = context.params?.id;
	const product = await fetch(
		`http://localhost:4000/getProductById/${productId}`
	);
	const data = await product.json();

	if (data.length === 0) {
		return {
			redirect: {
				destination: "/product404",
				permanent: false,
			},
		};
	}

	return {
		props: data[0],
	};
};
