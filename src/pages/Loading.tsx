import { useEffect, useRef, useState } from "react";
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
  const hasFetched = useRef(false);

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
  const lastId = searchParams.get("lastID");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    // Simulate API fetch
    if (!imagePath || !name) {
      console.error("Invalid Image Path and Name");
      setFetchedText("...");
      return;
    }
    console.log(imagePath);
    console.log(name);
    console.log("lasId: " + lastId)
    
    fetch(
      `http://localhost:3000/api/extract?imagePath=${imagePath}.jpg&name=${name}`
    )
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        const parsed = jsonToExtraction(data);
        const key = Object.keys(parsed)[0];
        console.log(Object.values(parsed[key].logInformation).join("\n"));
        setFetchedText(Object.values(parsed[key].logInformation).join("\n"));
        
        const body = {
          imagePath,
          textContent: parsed[key].imagePrompt,
          outputImagePath: parsed[key].cardPrompt.imageSrc,
        };
        
        try {
          const res = await fetch("http://localhost:3000/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        
          const data = await res.json();
          console.log(data)
          setShowButton(true);
        } catch (error) {
          console.error("Error:", error);
        } 
      })
      .catch((err) => {
        console.error("Error fetching text:", err);
        setFetchedText("Error loading text");
      });
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowButton(true);
  //   }, 5000); // Show button after 5 seconds

  //   return () => clearTimeout(timer);
  // }, []);

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
          onClick={() => navigate(`/CardPreview?id=${imagePath}` + (!!lastId ? `&lastId=${lastId}`: ""))}
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
    let currentText = "";

    setDisplayedText(""); // reset if `text` changes

    const interval = setInterval(() => {
      currentText += text[index];
      setDisplayedText(currentText);

      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return <div className={styling.animated_text}>{displayedText}</div>;
}