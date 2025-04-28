import React, { useEffect, useState } from 'react'
import styles from '../styles/page-Battle.module.css'
import Healthbar from '../components/Healthbar'
import CardDisplay from '../components/CardDisplay'
import BasicAttack from '../components/VFX/BasicAttack'
import { registerVFXSetter, triggerBasicAttack } from '../utils/util_BasicAttack'

interface RoundCount {
  round_no: number;
}

export default function(){
  const [showVFX, setShowVFX] = useState(false);
 
  useEffect(() => {
    registerVFXSetter(setShowVFX);
  }, []);

  return (
    <div className={styles.background_img}>
      <div id={styles.round_text}>Round 1</div>
      <div id={styles.battle_area}>
        <div id={styles.card_cont}>
          <CardDisplay></CardDisplay>
          <CardDisplay></CardDisplay>
        </div>
        <div id={styles.heart_cont}>          
          <Healthbar health={30} maxHealth={100}></Healthbar>
          <Healthbar health={7} maxHealth={10}></Healthbar>
        </div>
      </div>
      
      <button onClick={triggerBasicAttack}>Trigger Basic Attack</button>
      {showVFX && (
          <div className={styles.vfx_layer}>
            <BasicAttack />
          </div>
        )}
    </div>
  )
}
