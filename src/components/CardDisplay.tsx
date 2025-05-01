import React from 'react'
import styles from '../styles/comp-CardDisplay.module.css'
import {motion} from 'framer-motion'
import { shakeAnimation } from '../utils/animationUtil'

interface Props {
  path?: string;
  attackedState: boolean;
}

export default function CardDisplay(props: Props) {

  function cutPath(path?: string): string{
    const newPath: string = ""
    return ""
  }


  return(
    <motion.div 
      className={styles.card_holder} 
      style={{ backgroundImage: `url("/assets/images/winner-image.png")` }} // `url(${cutPath(props.path)})`
      variants={shakeAnimation}
      animate={props.attackedState ? "shake" : ""} 
    
    ></motion.div>
  )
}
