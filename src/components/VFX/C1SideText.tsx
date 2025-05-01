import React from 'react'
import styles from '../../styles/vfx-Styling.module.css'
import { C1Damage } from '../../utils/animationUtil';
import {motion} from 'framer-motion'

interface Props {
  isVisible: boolean;
  text: string;
  color?: string;
}

export default function(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <motion.div 
      className={styles.c1_side_text}
      style={{color: props.color}}
      variants={C1Damage}
      initial="initial"
      animate="animate"
      exit="exit"
      >
      {props.text}
    </motion.div>
  )
}