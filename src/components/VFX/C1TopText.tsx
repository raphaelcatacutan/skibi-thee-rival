import React from 'react'
import styles from '../../styles/vfx-Styling.module.css'

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
    <div className={styles.c1_top_text}>{props.text}</div>
  )
}