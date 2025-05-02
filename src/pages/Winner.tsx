import React, { useEffect, useRef, useState } from "react";
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
	const [hasInteracted, setHasInteracted] = useState(false);
	const hasFetched = useRef(false);
	
	useEffect(() => {
		const randomVideo = videos[Math.floor(Math.random() * videos.length)];
		setSelectedVideo(randomVideo);

		const timer = setTimeout(() => {
			setShowButton(true);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (hasFetched.current) return;
  hasFetched.current = true;
		if (!imagePath) return;

		fetch("http://localhost:3000/api/score", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ imageId: imagePath }),
		})
			.then(async (res) => {
				const data = await res.json();
				console.log(data)
			})
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

	function displayWinner(e: React.MouseEvent<HTMLDivElement>){
		const a1 = document.getElementById("winner_bgm") as HTMLAudioElement;
		const a2 = document.getElementById("winner_cheer") as HTMLAudioElement;
		const a3 = document.getElementById("winner_ez") as HTMLAudioElement;

		setHasInteracted(true)
		e.currentTarget.style.visibility = 'visible';
		a1.play()
		setTimeout(() => {
		}, 200);
		setTimeout(() => {
			a2.play()
		}, 500);
		setTimeout(() => {
			a3.play()
		}, 1000);
	}

	return (
		<div className="winner-container" onClick={displayWinner}>
				<div style={{visibility: hasInteracted ? 'visible' : 'hidden'}} className="mask-winner">
					<audio id="winner_bgm" src="/assets/sounds/winner_bgm.mp3"/>
					<audio id="winner_cheer" src="/assets/sounds/winner_cheer.mp3"/>
					<audio id="winner_ez" src="/assets/sounds/winner_ez.mp3"/>
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
		</div>
	);
}
