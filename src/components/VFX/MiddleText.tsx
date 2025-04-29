import React from 'react'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
  text: string;
}

export default function(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div className={styles.mid_text}>{props.text}</div>
  )
}