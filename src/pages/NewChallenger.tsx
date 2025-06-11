import React, { useEffect, useState } from "react";
import { Card } from "../utils/types";
import { jsonToCards } from "../utils/parser";
import styling from "../styles/page-newchallenger.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";

const images = [bg1, bg2, bg3];

const CardGallery: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState("");
	const [cards, setCards] = useState<Record<string, Card>>({});
	const [loading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const fetchCards = () => {
		setLoading(true);
		fetch("http://localhost:3000/api/images?isSkibidi=false")
			.then((res) => res.json())
			.then((data) => {
				const parsed = jsonToCards(data);
				setCards(parsed);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch card data:", err);
				setLoading(false);
			});
	};

	useEffect(() => {
		const randomImage = images[Math.floor(Math.random() * images.length)];
		setSelectedImage(randomImage);
		fetchCards();
	}, []);

	useEffect(() => {
		fetchCards();

		const socket = new WebSocket("ws://localhost:5000");

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			console.log("Received from backend:", event.data);
			fetchCards();
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		return () => {
			socket.close();
		};
	}, []);

	if (loading) return <div className="p-4 text-lg">Loading cards...</div>;

	const lastId = searchParams.get("lastId");
	const handleOnClick = (imagePath:string, name:string) => {
		navigate(`/loading?imagePath=${imagePath}&name=${name}` + (!!lastId ? `&lastID=${lastId}` : ""))
	}

	return (
		<div className={styling.page_wrapper}>
			<div className={styling.background_wrapper}>
				<div
					className={styling.background_img}
					style={{ backgroundImage: `url(${selectedImage})` }}
				/>
			</div>

			<div className={styling.content_area}>
				<div className={styling.loading_cont}>
					<img
						src="/assets/images/textLogo.png"
						alt="logo"
						className="winner-image"
					/>
				</div>
				<div className={styling.loading_text}>Choose a New Challenger!</div>
				<div className={styling.card_grid}>
					{Object.entries(cards).map(([key, card]) => (
						<div
							onClick={() => handleOnClick(key, card.name)}
							key={key}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								background: "#00000050", // dark forest green
								padding: "16px",
								borderRadius: "12px",
								boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
								transition: "transform 0.2s",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform =
									"scale(1.05)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform = "scale(1)")
							}
						>
							<img
								src={`http://localhost:5000/data/${key}.jpg`}
								alt={card.name}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: "8px",
								}}
							/>
							<div
								style={{
									fontSize: "0.875rem",
									fontWeight: 600,
									textAlign: "center",
									marginTop: "8px",
									color: "white",
								}}
							>
								{card.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CardGallery;
