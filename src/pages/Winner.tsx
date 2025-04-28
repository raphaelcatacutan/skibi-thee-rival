import React, { useEffect, useState } from "react";
import "../styles/Winner.css"; // Add a CSS file for animations

const videos = ["bg1.mp4"];

export default function () {
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  return (
    <div className="winner-container">
      {/* Background Video */}
      <video
        src={`/assets/videos/bg1.mov`}
        autoPlay
        loop
        muted
        className="winner-video"
      />

      {/* Card Image */}
      <div className="winner-foreground">
        {/* Winner Name */}
        <h2 className="winner-text">Floydilayo Win</h2>

        {/* Winner Image */}
        <img
          src="/assets/images/winner-image.png"
          alt="Winner"
          className="winner-image"
        />
      </div>
    </div>
  );
}
