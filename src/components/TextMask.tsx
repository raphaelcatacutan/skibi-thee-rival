import React, { useEffect, useState } from 'react'
import styles from '../styles/page-Battle.module.css'
import {motion} from 'framer-motion'
import { shakeAnimation } from '../utils/animationUtil'
import { text } from 'stream/consumers'

interface Props{
  isVisible: boolean
  message: string // ready, fight/draw,
  font: string
  // textanimation: string
  color?: string
}

export default function TextMask(props: Props){
  if(!props.isVisible){
    return null;
  }
  // const [useFont, setFont] = useState("")

  // useEffect(() => {
  //   if (props.message.toLowerCase() === "ready") {
  //     setFont("ready")
  //   } else {
  //     setFont("fight")
  //   }
  // }, [])

  return(
    <div className={styles.mask_text_cont}>
      <motion.div
        style={{fontFamily: `${props.font}`}}>
          {props.message}
      </motion.div>
    </div>
  )
}