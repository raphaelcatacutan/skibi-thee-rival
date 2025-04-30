import React from 'react'
import { motion } from 'framer-motion'
import { shakeAnimation } from '../../utils/animationUtil'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <motion.div 
      id={styles.BonkAtkC2} 
      variants={shakeAnimation}
      animate={props.isVisible ? "C2BonkAttack" : ""}>
      <img src="/assets/images/C2Bbatt.png" alt="batt" style={{width: 300, height: 300}}/>
    </motion.div>
  )
}



