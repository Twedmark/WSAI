import { NextPage } from "next";
import React from "react";

import styles from "./studio.module.css";

const studio: NextPage = () => {
	return (
		<>
			<section className={styles.textAndImgContainer}>
				<div className={styles.textContainer}>
					<div className={styles.textArea}>
						<h2 style={{ textAlign: "center" }}>Artilleriet Studio</h2>
						<p style={{ textAlign: "center" }}>
							Artilleriet Studio skapar inredningsprojekt som utmanar idén om
							vad en inredning kan vara. Med människan och livet i centrum
							bygger vi privata hem och offentliga miljöer som utstrålar harmoni
							och kreativitet. Med stor vana av att skräddarsy personliga
							lösningar åtar vi oss varje uppdrag med viljan att leverera
							upplevelser långt utöver vad som förväntas. Med fokus på hög
							kvalitet och internationell design skapar vi unika platser som tar
							dig hem, var du än är.
						</p>
						<p style={{ textAlign: "center" }}>
							Artilleriet står för en eklektisk samling av heminredning, möbler
							och detaljer. Sortimentet består av en noga utvald och handplockad
							mix av klassisk vintage och innovativ design från hela världen. Vi
							arbetar med välkända varumärken med erkänt hög kvalitet, och
							mindre kända leverantörer med stor potential.
						</p>
					</div>
				</div>
				<div className={styles.imageArea}>
					<img
						className={styles.img}
						src="https://img2.storyblok.com/748x0/f/118230/1500x2250/0daaf26e08/2020-05-26_artilleriet-kinna10317-kopiera.jpeg"
						alt="StudioImg"
					/>
				</div>
			</section>
			<section className={styles.textAndImgContainer}>
				<div className={styles.imageArea}>
					<img
						className={styles.img}
						src="https://img2.storyblok.com/748x0/f/118230/1500x2000/fd4826b791/2016-03-14-hemma-hos-lisa31303-kopiera.jpeg"
						alt="StudioImg"
					/>
				</div>
				<div className={styles.textContainer}>
					<div className={styles.textArea}>
						<h2>Vi erbjuder</h2>
						<h5>PRIVAT INREDNINGSKONSULATION</h5>
						<p>
							Baserat på vårt utvalda utbud av möbler, detaljer och belsyning
							från eklusiva varumärken runt om i världen skapar vi individuella
							designlösningar efter din personliga preferens och smak. Vi tar
							oss an både större och mindre inredningsprojekt, allt från enstaka
							rum till hela hem.
						</p>
						<h5>FÖRETAG B2B</h5>
						<p>
							Artilleriet Studio skapar offentliga rum som utmanar idén om hur
							en arbetsplats, mötesplats, ett hotell eller en restaurang kan se
							ut och upplevas. Med kreativa och okonventionella lösningar skapar
							vi miljöer som får människor att trivas och må bra både hemma som
							på jobbet.
						</p>
						<h5>PRIVAT SHOPPING</h5>
						<p>
							Din privata inredningssäljare guidar dig genom sortimentet, online
							eller i butik, och helt efter dina önskemål.
						</p>
					</div>
				</div>
			</section>
			<section className={styles.textAndImgContainer}>
				<div className={styles.textContainer}>
					<div className={styles.textArea}>
						<p>
							" We always build our worlds around people and life itself, this –
							along with our wide range of global design – makes for a personal
							and friendly atmosphere way above the expected. With creativity
							and high quality we create unique places and individual solutions,
							welcoming you home – wherever you are. "
						</p>
						<p style={{ textAlign: "right" }}>- Christian & Sofie</p>
					</div>
				</div>
				<div className={styles.imageArea}>
					<img
						className={styles.img}
						src="https://img2.storyblok.com/748x0/f/118230/2000x2667/fec042418f/1.jpg"
						alt="StudioImg"
					/>
				</div>
			</section>
		</>
	);
};

export default studio;
