import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Winner.css";

const videos = ["bg1.mp4"];

export default function () {
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);

    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
        <h2 className="winner-text">Floydilayo Win</h2>
        <img
          src="/assets/images/winner-image.png"
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
