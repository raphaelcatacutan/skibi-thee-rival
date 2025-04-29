import React from 'react'
import styles from '../styles/comp-CardDisplay.module.css'

interface Props {
  path: string
}

export default function CardDisplay(props: Props) {

  return(
    <div className={styles.card_holder} 
    style={{ backgroundImage: `url(${props.path})` }}></div>
  )
}
