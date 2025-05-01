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

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Navigate to battle page with both cards
    if (selectedCard && imagePath) {
      //navigate(`/battle?card1=${cardId}&card2=${selectedCard.cardId}`);
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setShowConfirmation(false);
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
        <div className={styling.card_grid}>
          {Object.entries(cards).map(([key, card]) => {
            console.log(key);
            if (cardId == key) return; // di niya pwedeng labanan sarili niya
            return (
              // yung card id ng bawat cards is yung key so yun yung ipapasa mo sa battle kasama ng cardId ng current card
              <div
                key={key}
                className={styling.card_item}
                onClick={() => handleCardClick(card)}
              >
                <img
                  src={`http://localhost:5000/output/${cardId}-preview.png`}
                  alt="logo"
                  className="winner-image"
                />
                <div>Raphael</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
