import { FormEvent, useRef } from "react";
import styles from "./addProduct.module.css";

const AddProduct = () => {
	const name = useRef<HTMLInputElement>(null);
	const price = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);
	const images = useRef<HTMLInputElement>(null);

	function submit(e: FormEvent<HTMLFormElement>) {
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
		// with one space beteen each 3 digits
		// and " sek" at the end
		let priceString = priceValue?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

		priceString = priceString + " SEK";

		console.log(
			nameValue,
			priceValue,
			descriptionValue,
			imagesArrayTrimmedFiltered,
			priceString
		);
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
