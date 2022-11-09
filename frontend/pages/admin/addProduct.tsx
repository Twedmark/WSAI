import { useRouter } from "next/router";
import React from "react";
import { FormEvent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";
import styles from "./addProduct.module.css";

import sanitizeHtml from "sanitize-html";

const AddProduct = () => {
	const router = useRouter();
	const name = useRef<HTMLInputElement>(null);
	const price = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);
	const images = useRef<HTMLInputElement>(null);

	const user = useSelector(selectAuthState);

	useEffect(() => {
		if (user.isLoading === false && !user?.roles?.includes("Admin")) {
			router.push("/");
		}
	}, [user.isLoading]);

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const nameValue = name.current?.value;
		const priceValue = price.current?.value;
		const descriptionValue = description.current?.value;
		const imagesValue = images.current?.value;

		const imagesArray = imagesValue?.split(",");
		// remove ALL whitespace from each image
		const imagesArrayTrimmed = imagesArray?.map(image =>
			image.replace(/\s/g, "")
		);
		//remove any empty strings
		const imagesArrayTrimmedFiltered = imagesArrayTrimmed?.filter(
			image => image !== ""
		);

		//convert price to a string,
		// with one space between each 3 digits
		// and " sek" at the end
		let priceString = priceValue?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

		priceString = priceString + " SEK";

		const descriptionValueClean = sanitizeHtml(descriptionValue);

		let newProduct = {
			name: nameValue,
			price: priceString,
			description: descriptionValueClean,
			images: imagesArrayTrimmedFiltered?.join(","),
		};

		console.log(newProduct);

		const response = await fetch("http://localhost:4000/addProduct", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});
		if (response.status === 200) {
			const data = await response.json();
			console.log(data);

			alert("Product added!");
			if (confirm("Go to the new products page?")) {
				router.push(`/product/${data.id}`);
			}
			//clear form
			name.current!.value = "";
			price.current!.value = "";
			description.current!.value = "";
			images.current!.value = "";
		} else {
			alert("Something went wrong");
		}
	}

	return (
		<div className={styles.addProductContainer}>
			<h1>Add Product</h1>
			<form onSubmit={e => submit(e)}>
				<div className={styles.formGroup}>
					<label htmlFor="name">Name</label>
					<input type="text" id="name" ref={name} />
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="price">Price</label>
					<input type="number" id="price" ref={price} />
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="description">Description</label>
					<textarea id="description" ref={description} />
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="images">Images</label>
					<input type="text" id="images" ref={images} />
				</div>
				<button type="submit">Add Product</button>
			</form>
		</div>
	);
};

export default AddProduct;
