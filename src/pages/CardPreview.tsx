import React, { useEffect, useState } from "react";
import "../styles/CardPreview.css";
import CardGenerator from "../components/CardGenerator";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CardConfig, defaultCardConfig } from "../utils/CardTypes";

const videos = ["bg2.mp4"];

export default function CardPreviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const imagePath = searchParams.get("id") || ""; // no need for useState here if it doesn't change
  const [cardConfig, setCardConfig] = useState<CardConfig>(defaultCardConfig);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showButtons, setShowButtons] = useState(false);

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
    <p>
      <div className="button-header">
        {/* Buttons */}
        {showButtons && (
          <button
            className="proceed-button"
            onClick={() => navigate("/NewChallenger")}
          >
            Go Back to Choose New Challenger
          </button>
        )}
        {showButtons && (
          <button
            className="proceed-button"
            onClick={() => navigate("/Rivals")}
          >
            Proceed to Choose Rival
          </button>
        )}
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

      {/* Card Image */}
      <div className="card-image-container">
        <CardGenerator cardConfig={cardConfig} cardId={imagePath} />
      </div>

      {/* Card Text */}
      <div className="card-text-container">
        <p style={{ display: "flex", alignItems: "center" }}>
          <h2 className="card-txt"></h2>
          <h2 className="card-inf">{cardConfig.cardTitle}</h2>
        </p>
        <div className="card-pair">
          <h3 className="card-subtxt">HP:</h3>
          <h4 className="card-info">{cardConfig.hpValue}</h4>
        </div>
        <div className="card-pair">
          <h3 className="card-subtxt">Atk:</h3>
          <h4 className="card-info">{cardConfig.damageValue}</h4>
        </div>
        <div className="card-pair">
          <h3 className="card-subtxt">Crit Rate:</h3>
          <h4 className="card-info">{cardConfig.critRateValue}</h4>
        </div>
        <h3 className="card-subtxt">Skills:</h3>
        <div className="card-pair">
          <h3 className="card-subtxt"></h3>
          <ul className="skills-list">
            {cardConfig.skillNames.map((skill, index) => (
              <li key={index}>
                <h4 className="card-info">{skill}</h4>
              </li>
            ))}
          </ul>
        </div>

        <h5 className="description">Description:</h5>
        <h5 className="description">{cardConfig.description}</h5>
      </div>
    </p>
  );
}
