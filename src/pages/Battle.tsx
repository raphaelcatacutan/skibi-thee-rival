import React from 'react'
import Header from '../components/Header'
import styles from '../styles/page-Battle.module.css'
import Healthbar from '../components/Healthbar'

export default function(){
  return (
    <div className={styles.background_img}>
      <div id={styles.battle_area}>
        <div id={styles.card_cont}>
          <div id={styles.card_one} className={styles.card}></div>
          <div id={styles.card_two} className={styles.card}></div>
        </div>
        <div id={styles.heart_cont}>          
          <Healthbar health={7} maxHealth={10}></Healthbar>
          <Healthbar health={7} maxHealth={10}></Healthbar>
        </div>
      </div>
    </div>
  )
}
