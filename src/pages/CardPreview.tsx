import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import styling from "../styles/page-CardPreview.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json"; // Adjust path if needed

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
      <div className={styling.background_wrapper}>
        <div
          className={styling.background_img}
          style={{ backgroundImage: `url(${selectedImage})` }}
        />
      </div>

      <div className={styling.rank_cont}>
        <div id={styling.leaderboard_text}>Loading</div>
        <div id={styling.rank_list}></div>
      </div>

      {/* Bottom Left Lottie Animation */}
      <div className={styling.bottom_left}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>

      {/* Bottom Right Animated Text */}
      <div className={styling.bottom_right}>
        <AnimatedText text="Placeholder" />
      </div>
    </div>
  );
}

function AnimatedText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 100); // moderate fast (100ms per character)
    return () => clearInterval(interval);
  }, [text]);

  return <div className={styling.animated_text}>{displayedText}</div>;
}
