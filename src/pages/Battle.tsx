import React from 'react'
import Header from '../components/Header'
import styles from '../styles/page-Battle.module.css'
import Healthbar from '../components/Healthbar'
import CardDisplay from '../components/CardDisplay'

interface RoundCount {
  round_no: number;
}

export default function(){
  return (
    <div className={styles.background_img}>
      <div id={styles.round_text}>Round 1</div>
      <div id={styles.battle_area}>
        <div id={styles.card_cont}>
          <CardDisplay></CardDisplay>
          <CardDisplay></CardDisplay>
        </div>
        <div id={styles.heart_cont}>          
          <Healthbar health={7} maxHealth={10}></Healthbar>
          <Healthbar health={7} maxHealth={10}></Healthbar>
        </div>
      </div>
    </div>
  )
}
