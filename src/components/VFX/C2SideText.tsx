import React from 'react'
import styles from '../../styles/vfx-Styling.module.css'
import { C2Damage } from '../../utils/animationUtil';
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
      className={styles.c2_side_text} 
      style={{color: props.color}}
      variants={C2Damage}
      initial="initial"
      animate="animate"
      exit="exit"
      >
        {props.text}
    </motion.div>
  )
}