import React, { use, useEffect, useState } from 'react'
import styles from '../styles/page-Battle.module.css'
import vfx from '../styles/vfx-Styling.module.css'
import Healthbar from '../components/Healthbar'
import CardDisplay from '../components/CardDisplay'
// import BasicAttack from '../components/VFX/BasicAttack'
import * as animation from '../utils/animationUtil'
import C1BasicAttack from '../components/VFX/C1BasicAttack'
import C2BasicAttack from '../components/VFX/C2BasicAttack'

interface RoundCount {
  round_no: number;
}

export default function(){
  const [doBasicAtkC1, setBasicAtkC1] = useState(false);
  const [doBasicAtkC2, setBasicAtkC2] = useState(false);

  useEffect(() => {
    animation.registerVFXSetter(setBasicAtkC1)
    animation.registerVFXSetter(setBasicAtkC2)
  }, []);

  useEffect(() => {
  }, []);


  // function triggerBasicAttack() {
  //   animation.triggerVfx(setBasicAtkC1, 500); // 2 seconds
  // }

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

      
      <button onClick={animation.triggerC1BasicAttack}>Attack!</button>
      
      <C2BasicAttack isVisible={doBasicAtkC1} /> {/*card 1*/}
      <C1BasicAttack isVisible={doBasicAtkC2} /> {/*card 2*/}

      {/* <BasicAttack isVisible={false}></BasicAttack> */}
      {/* <button onClick={triggerBasicAttack}>Trigger Basic Attack</button>
      {showVFX && (
          <div className={styles.vfx_layer}>
            
          </div>
        )} */}
    </div>
  )
}
