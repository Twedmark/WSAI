import products from "./products.json";

const StupidLoop = () => {
	/* let baseUrl = "https://artilleriet.centra.com/api/checkout/products/";

	async function asd() {
		let products = [];
		for (let i = 0; i < 1000; i++) {
			let number = 75000 + i;
			const url = baseUrl + number;
			let data;
			try {
				const response = await fetch(url);
				data = await response.json();
			} catch (error) {
				console.log(error);
			}
			if (data.errors) {
				console.log("error");
			} else {
				products.push(data.product);
			}
		}
		console.log("ASDASD", products);
	}

	asd(); */
	/* async function asd() {
		let newProducts = [];
		products.forEach(async (product, index) => {
			if (product.media.length <= 0) {
				console.log("no media", product);
				return;
			}

			let newProduct = {
				productId: index,
				name: product.name,
				price: product.price,
				description: product.descriptionHtml,
				material: null,
				dimensions: null,
				specification: null,
				images: product.media.portrait,
			};
			newProducts.push(newProduct);
		});
		console.log("ASDASD", newProducts);
	}

	asd(); */
};

export default StupidLoop;