import { useEffect, useState } from "react";
import styling from "../styles/page-Loading.module.css";
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_disco.jpg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json"; // Adjust path if needed
import { jsonToExtraction } from "../utils/parser";
import { useSearchParams, useNavigate } from "react-router-dom";

const images = [bg1, bg2, bg3];

export default function () {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [fetchedText, setFetchedText] = useState("Loading...");
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

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

  const [searchParams] = useSearchParams();
  const imagePath = searchParams.get("imagePath");
  const name = searchParams.get("name");

  useEffect(() => {
    // Simulate API fetch
    if (!imagePath || !name) {
      console.error("Invalid Image Path and Name");
      setFetchedText("...");
      return;
    }
    console.log(imagePath);
    console.log(name);
    // return
    fetch(
      `http://localhost:3000/api/extract?imagePath=${imagePath}.jpg&name=${name}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const parsed = jsonToExtraction(data);
        const keys = Object.keys(parsed)[0];
        console.log(Object.values(parsed[keys].logInformation).join("\n"));
        setFetchedText(Object.values(parsed[keys].logInformation).join("\n"));
      })
      .catch((err) => {
        console.error("Error fetching text:", err);
        setFetchedText("Error loading text");
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000); // Show button after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styling.page_wrapper}>
      <div className={styling.background_wrapper}>
        <div
          className={styling.background_img}
          style={{ backgroundImage: `url(${selectedImage})` }}
        />
      </div>

      <div className={styling.loading_cont}>
        <img
          src="/assets/images/textLogo.png"
          alt="logo"
          className="winner-image"
        />
        <div id={styling.loading_list}></div>
      </div>

      {showButton && (
        <button
          className={`${styling.proceedButton} ${styling.show}`}
          onClick={() => navigate("/CardPreview")}
          style={{ zIndex: 10 }}
        >
          Proceed to Card Preview
        </button>
      )}

      {/* Bottom Left Lottie Animation */}
      <div className={styling.bottom_left}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>

      {/* Bottom Right Animated Text */}
      <div className={styling.bottom_right}>
        <AnimatedText text={fetchedText} />
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
