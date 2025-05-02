import React from 'react'
import styles from '../styles/comp-CardDisplay.module.css'
import {motion} from 'framer-motion'
import { shakeAnimation } from '../utils/animationUtil'

interface Props {
  path?: string;
  attackedState: boolean;
}

export default function CardDisplay(props: Props) {

  return(
    <motion.div 
      className={styles.card_holder} 
      style={{ backgroundImage: `url("${props.path}")` }} // `url(${cutPath(props.path)})`
      variants={shakeAnimation}
      animate={props.attackedState ? "shake" : ""} 
    
    ></motion.div>
  )
}
