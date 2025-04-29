import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import styling from "../styles/page-Leaderboards.module.css";
import { Card } from "../utils/types";
import { jsonToCards } from "../utils/parser";

export default function () {
	// bg
	const [audioPlayed, setAudioPlayed] = useState(false);
	const [leaderboardData, setLeaderboardData] = useState<
		Record<string, Card>
	>({});

	useEffect(() => {
		fetch("http://localhost:3000/api/images?isSkibidi=true")
			.then((res) => res.json())
			.then((data) => {
				const parsed = jsonToCards(data);
				setLeaderboardData(parsed);
			})
			.catch((err) => {
				console.error("Failed to fetch card data:", err);
			});
	}, []);

	useEffect(() => {
		const handleUserInteraction = () => {
			if (!audioPlayed) {
				const audio = document.getElementById(
					"background-music"
				) as HTMLAudioElement | null;
				if (audio) {
					audio.play();
					setAudioPlayed(true);
				}
			}
		};
		document.addEventListener("click", handleUserInteraction);
		return () => {
			document.removeEventListener("click", handleUserInteraction);
		};
	}, [audioPlayed]);

	return (
		<div className={styling.background_img}>
			<audio
				id="background-music"
				src="/assets/sounds/bgmusic.mp3"
				loop
				hidden
			/>
			<div className={styling.userinteraction_mask}></div>
			<div className={styling.rank_cont}>
				<div id={styling.leaderboard_text}>Leaderboards</div>
				<div id={styling.rank_list}>
					{Object.entries(leaderboardData)
						.slice(0, 10)
						.map(([key, player], index) => (
							<div className={styling.rank_slot} key={key}>
								<div className={styling.rank_count}>
									{index + 1}
								</div>
								<div className={styling.rank_name}>
									{player.name}
								</div>
								<div className={styling.rank_win}>
									{player.score}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
