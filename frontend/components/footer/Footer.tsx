import styles from "./Footer.module.css";
import React from "react";

const Footer = () => {
	return (
		<nav className={styles.footerContainer}>
			<div className={styles.halfWidth}>
				<h3>Customer Service</h3>
				<ul>
					<li>
						<a href="/contact">Contact Us</a>
					</li>
					<li>
						<a href="/faq">FAQ</a>
					</li>
					<li>
						<a href="/delivery">Delivery</a>
					</li>
					<li>
						<a href="/returns">Returns</a>
					</li>
					<li>
						<a href="/terms">Terms & Conditions</a>
					</li>
					<li>
						<a href="/privacy">Privacy Policy</a>
					</li>
				</ul>
			</div>
			<div className={styles.fullWidth}>
				<h2>WSAI</h2>
			</div>
			<div className={styles.halfWidth}>
				<h3>Follow Us</h3>
				<ul>
					<li>
						<a href="https://www.instagram.com/wsaistore/">Instagram</a>
					</li>
					<li>
						<a href="https://www.facebook.com/wsaistore/">Facebook</a>
					</li>
					<li>
						<a href="https://www.pinterest.com/wsaistore/">Pinterest</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Footer;
