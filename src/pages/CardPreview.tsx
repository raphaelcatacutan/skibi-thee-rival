import React, { useEffect, useState } from "react";
import "../styles/CardPreview.css";
import CardGenerator from "../components/CardGenerator";
import { useSearchParams } from "react-router-dom";
import { CardConfig, defaultCardConfig } from "../utils/CardTypes";

const videos = ["bg2.mp4"];

export default function CardPreviewPage() {
  const [searchParams] = useSearchParams();
  const imagePath = searchParams.get("id") || ""; // no need for useState here if it doesn't change
  const [cardConfig, setCardConfig] = useState<CardConfig>(defaultCardConfig);
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  useEffect(() => {
    if (!imagePath) return;

    fetch(`http://localhost:3000/api/images?filter=${imagePath}`)
      .then((res) => res.json())
      .then((data) => {
        setCardConfig(data[imagePath]);
      })
      .catch((err) => {
        console.error("Failed to fetch image config", err);
      });
  }, [imagePath]);

  return (
    <>
      {/* Card Image */}
      <div className="card-image-container">
        <CardGenerator cardConfig={cardConfig} cardId={imagePath} />
      </div>

      {/* Card Text */}
      <div className="card-text-container">
        <h2 className="card-txt">{cardConfig.cardTitle}</h2>
        <h4 className="card-subtxt">HP: {cardConfig.hpValue}</h4>
        <h4 className="card-subtxt">Atk: {cardConfig.damageValue}</h4>
      </div>

      {/* Background Video */}
      <div className="card-container">
        <video
          src={`/assets/videos/${selectedVideo}`}
          autoPlay
          loop
          muted
          className="card-video"
        />
      </div>
    </>
  );
}
