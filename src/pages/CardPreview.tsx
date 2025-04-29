import React, { useEffect, useState } from "react";
import "../styles/CardPreview.css"; // Add a CSS file

const videos = ["bg2.mp4"];

export default function () {
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  return (
    <>
      {/* Card Image */}
      <div className="card-image-container">
        <img
          src="/assets/images/winner-image.png"
          alt="Card"
          className="card-image"
        />
      </div>

      {/* Card Text */}
      <div className="card-text-container">
        <h2 className="card-txt">Floydilayo</h2>
        <h4 className="card-subtxt">HP: </h4>
        <h4 className="card-subtxt">Atk: </h4>
      </div>

      <div className="card-container">
        {/* Background Video */}
        <video
          src={`/assets/videos/bg2.mp4`}
          autoPlay
          loop
          muted
          className="card-video"
        />
      </div>
    </>
  );
}
