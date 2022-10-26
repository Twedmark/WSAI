import { useRouter } from "next/router";
import styles from "./Product.module.css";

const Product = () => {
	const router = useRouter();
	const { productId } = router.query;

	function addToCart() {
		console.log("add to cart");
	}

	return (
		<div>
			<main className={styles.main}>
				<div className={styles.imageContainer}>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
					<img
						src="https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
						alt="Picture of the author"
					/>
				</div>
				<div className={styles.infoScrollContainer}>
					<div className={styles.infoContainer}>
						<h1 className={styles.title}>Posthorn</h1>
						<p className={styles.description}>
							Posthorn, från Kalmar Werkstätten, är en minimalistisk pendellampa
							med en charmigt öglad arm som håller två skärmar i siden. De
							naturliga lampskärmarna bidrar till ett omgivande ljus i alla
							riktningar. I 140 år har Kalmar ägnat sig åt anrikt hantverk och
							progressiv design för att skapa dekorativ och funktionell
							belysning. Det österrikiska hantverket är elegant i geometrin och
							delikat i sina proportioner. Kombinationen av ärliga material,
							många års erfarenhet inom hantverket och modern design, ingjuter
							lamporna en rigorös minimalism med värme och mänsklighet.
						</p>
						<h2>12000 kr</h2>
						<button onClick={addToCart}>Add to cart</button>
					</div>
				</div>
			</main>
			<article className={styles.article}>
				<h1 className={styles.title}>Product Name</h1>
				<p className={styles.description}>
					Some further technical information about the product
				</p>
				<p>
					Material: Polerad nickel eller mässing, skärm i silke. Svart
					textilsladd.
				</p>
				<p>
					Mått: Bredd: 60 cm Djup: 18 cm Lamphöjd: 27,5 cm Total höjd: max. 180
					cm
				</p>
				<p>
					Specifikationer: Rekommenderad ljuskälla: 2 x E14, 40W Ljuskälla ingår
					ej.
				</p>
			</article>
		</div>
	);
};

export default Product;

/* export const getServersideProps = async (context: any) => {
	const productId = context.params.productId;
	const product = await fetch(
		`http://localhost:3001/getProductById/${productId}`
	);

	const data = await product.json();

	return {
		props: {
			data,
		},
	};
}; */
