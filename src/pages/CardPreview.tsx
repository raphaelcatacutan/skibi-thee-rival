import React, { useEffect, useState } from "react";
import "../styles/CardPreview.css"; // Add a CSS file
import CardGenerator from "../components/CardGenerator";
import { useSearchParams } from "react-router-dom"

const videos = ["bg2.mp4"];

export default function () {
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  

  const [searchParams] = useSearchParams();
  const imagePath = searchParams.get("id");

  return (
    <>
      {/* Card Image */}
      <div className="card-image-container">
       <CardGenerator cardId={imagePath!}/>
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
