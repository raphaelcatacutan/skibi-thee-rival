import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import styling from "../styles/page-Loading.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";

const images = [bg1, bg2, bg3];

export default function () {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);
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
    <div className={styling.page_wrapper}>
      {/* Background only */}
      <div
        className={styling.background_img}
        style={{ backgroundImage: `url(${selectedImage})` }}
      />

      {/* Foreground content */}
      <div className={styling.rank_cont}>
        <div id={styling.leaderboard_text}>Loading</div>
        <div id={styling.rank_list}></div>
      </div>
    </div>
  );
}
