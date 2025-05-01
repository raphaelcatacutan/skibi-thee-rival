import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Winner.css";
import { jsonToCards } from "../utils/parser";

const videos = ["bg1.mp4"];

export default function () {
	const [selectedVideo, setSelectedVideo] = useState("");
	const [winnerName, setWinnerName] = useState("");
	const [showButton, setShowButton] = useState(false);
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const imagePath = searchParams.get("id") || "";

	useEffect(() => {
		const randomVideo = videos[Math.floor(Math.random() * videos.length)];
		setSelectedVideo(randomVideo);

		const timer = setTimeout(() => {
			setShowButton(true);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!imagePath) return;

		fetch("http://localhost:3000/api/score", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ imagePath }),
		})
			.then((res) => console.log(res.json))
			.catch((error) => console.error("Error:", error));
		fetch(`http://localhost:3000/api/images?filter=${imagePath}`)
			.then((res) => res.json())
			.then((data) => {
				const name =
					jsonToCards(data)[imagePath].cardTitle ??
					imagePath.split("-")[0];
				setWinnerName(name);
			})
			.catch((err) => {
				console.error("Failed to fetch image config", err);
			});
	}, [imagePath]);

	return (
		<div className="winner-container">
			<video
				src={`/assets/videos/bg1.mov`}
				autoPlay
				loop
				muted
				className="winner-video"
			/>

			<div className="winner-foreground">
				{/* fetch winner name*/}
				<h2 className="winner-text">{winnerName} Win</h2>
				<img
					src={`http://localhost:5000/output/${imagePath}-preview.png`} //fetch winner image
					alt="Winner"
					className="winner-image"
				/>
			</div>

			{showButton && (
				<button
					className="proceed-button"
					onClick={() => navigate("/Leaderboards")}
				>
					Proceed to Leaderboards
				</button>
			)}
		</div>
	);
}
