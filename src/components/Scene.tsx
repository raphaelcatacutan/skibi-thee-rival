import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { url } from 'inspector'
import bg1 from "../assets/images/scenes/bg_arena.jpg";
import bg2 from "../assets/images/scenes/bg_castle.jpeg";
import bg3 from "../assets/images/scenes/bg_dojo.jpeg";
import bg4 from "../assets/images/scenes/bg_tokyo.jpeg"; // change
import bg5 from "../assets/images/scenes/bg_rockymountains.jpeg";
import bg6 from "../assets/images/scenes/bg_jungle.jpeg";
import bg7 from "../assets/images/scenes/bg_snow.jpeg";
import style from '../styles/page-Battle.module.css'
import { shakeAnimation } from '../utils/animationUtil';
import { get } from 'http';

const images = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];
const audios = [
  "bgm_arena", "bgm_castle", "bgm_dojo",
  "bgm_tokyo", "bgm_rockymountains1", "bgm_jungle",
  "bgm_snow"  
];

interface Props {
  quake: boolean
  playMusic: boolean
}


export default function Scene(props: Props){
  const [getScene, setScene] = useState("");
  const [getMusic, setMusic] = useState("");
  
  useEffect(() => {
    const randomizer = Math.floor(Math.random() * images.length);
    const randomImage = images[randomizer];
    const randomMusic = audios[randomizer];
    setScene(randomImage);
    setMusic(randomMusic);
  }, []);  

  if (props.playMusic){
    const audio = document.getElementById("bg_music") as HTMLAudioElement;
    audio.volume = 0.5;
    audio.play();
  }

  return(
    <motion.div 
      className={style.background_img} 
      style={{backgroundImage: `url(${getScene})`}}
      variants={shakeAnimation}
      animate={props.quake ? "screenshake" : ""}
      >
        <audio id="bg_music" src={`/assets/sounds/${getMusic}.mp3`} loop={true}></audio>
    </motion.div>
  )
}