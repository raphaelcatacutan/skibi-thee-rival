import { useEffect, useState } from "react";
import styling from "../styles/page-rivals.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import { Card } from "../utils/types";
import { jsonToCards } from "../utils/parser";
import { useNavigate, useSearchParams } from "react-router-dom";

const images = [bg1, bg2, bg3];

export default function () {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imagePath = searchParams.get("imagePath");
  const cardId = searchParams.get("id");

  const fetchCards = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/images?isSkibidi=true")
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

  const handleCardClick = (key: string) => {

    navigate(`/Battle?card1=${cardId}&card2=${key}`)
  };
  if (loading) return <div className={styling.loading}>Loading cards...</div>;

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

        <div className={styling.loading_text}>Choose Your Rival!</div>

				<div className={styling.card_grid}>
					{Object.entries(cards).map(([key, card]) => {
            if (cardId == key) return; // di niya pwedeng labanan sarili niya
            return (
						<div
                key={key}
                onClick={() => handleCardClick(key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#00000050", // dark forest green
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={`http://localhost:5000/data/${cardId}.jpg`}
                  alt={card.cardTitle}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: "8px",
                    color: "white",
                  }}
                >
                  {card.cardTitle}
                </div>
              </div>
            )
          })}
				</div>
			</div>
    </div>
  );
}
