import React, { useEffect, useState } from "react";
import { Card } from "../utils/types";
import { jsonToCards } from "../utils/parser";
import styling from "../styles/page-newchallenger.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import { useNavigate, useSearchParams } from "react-router-dom";

const images = [bg1, bg2, bg3];

const CardGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [loading, setLoading] = useState(true);

  const fetchCards = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/images?isSkibidi=false")
      .then((res) => res.json())
      .then((data) => {
        const parsed = jsonToCards(data);
        setCards(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch card data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);
    fetchCards();
  }, []);

  useEffect(() => {
    fetchCards();

    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("Received from backend:", event.data);
      fetchCards();
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (loading) return <div className="p-4 text-lg">Loading cards...</div>;

  return (
    <div className={styling.page_wrapper}>
      <div className={styling.background_wrapper}>
        <div
          className={styling.background_img}
          style={{ backgroundImage: `url(${selectedImage})` }}
        />
      </div>

      <div className={styling.content_area}>
        <div className={styling.loading_cont}>
          <img
            src="/assets/images/textLogo.png"
            alt="logo"
            className="winner-image"
          />
        </div>

        <div className={styling.card_grid}>
          {Object.entries(cards).map(([key, card]) => (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "green",
                padding: "10px",
              }}
            >
              <img
                src={`http://localhost:5000/data/${key}.jpg`}
                alt={card.name}
                style={{
                  width: "100px",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textAlign: "center",
                  marginTop: "4px",
                }}
              >
                {card.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGallery;
