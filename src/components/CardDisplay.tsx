import React from 'react'
import styles from '../styles/card-display.module.css'

export default function CardDisplay() {
  return(
    <div id={styles.card_cont}>
      <div className={styles.card_holder}>
        card1
      </div>
      <div className={styles.card_holder}>
        card2
      </div>
    </div>  
  )
}
