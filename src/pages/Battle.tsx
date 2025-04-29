import React, { use, useEffect, useState } from 'react'
import styles from '../styles/page-Battle.module.css'
import vfx from '../styles/vfx-Styling.module.css'
import Healthbar from '../components/Healthbar' 
import CardDisplay from '../components/CardDisplay'
// import BasicAttack from '../components/VFX/BasicAttack'
import * as animation from '../utils/animationUtil'
import C1BasicAttack from '../components/VFX/C1BasicAttack'
import C2BasicAttack from '../components/VFX/C2BasicAttack'
import C1CritAttack from '../components/VFX/C1CritAttack'
import C2CritAttack from '../components/VFX/C2CritAttack'
import C1SelfCare from '../components/VFX/C1SelfCare'
import C2SelfCare from '../components/VFX/C2SelfCare'

interface RoundCount {
  round_no: number;
}

export default function(){
  const [doBasicAtkC1, setBasicAtkC1] = useState(false);
  const [doBasicAtkC2, setBasicAtkC2] = useState(false);
  const [doCritAtkC1, setCritAtkC1] = useState(false);
  const [doCritAtkC2, setCritAtkC2] = useState(false);
  const [doSelfCareC1, setSelfCareC1] = useState(false);
  const [doSelfCareC2, setSelfCareC2] = useState(false);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [doBasicAtkSFX, setBasicAtkSFX] = useState(false);
  const [doCritAtkSFX, setCritAtkSFX] = useState(false);

  useEffect(() => {
    animation.registerVFXSetter('C1BasicAttack', setBasicAtkC1)
    animation.registerVFXSetter('C2BasicAttack', setBasicAtkC2)
    animation.registerVFXSetter('C1CritAttack', setCritAtkC1)
    animation.registerVFXSetter('C2CritAttack', setCritAtkC2)
    animation.registerVFXSetter('C1SelfCare', setSelfCareC1)
    animation.registerVFXSetter('C2SelfCare', setSelfCareC2)
  }, []);

  useEffect(() => {
    if (hasInteracted){
      const audio = document.getElementById("bg_music") as HTMLAudioElement | null;
      audio?.play();  
    }
  }, [hasInteracted])

  function removeMask(e: React.MouseEvent<HTMLDivElement>){
    e.currentTarget.style.display = 'none';
    setHasInteracted(true);
  }

  function triggerBoth(){ 
    // animation.triggerVFX('C1BasicAttack', 500);
    animation.triggerVFX('C1BasicAttack');
    setTimeout(() => {
      animation.triggerVFX('C2BasicAttack')
    }, 1000);
  }

  return (
    <div className={styles.background_img}>
      <audio id="bg_music" src="/assets/sounds/battle_bgmusic.mp3"/>
      <div className={styles.mask_layer} onClick={removeMask}>
        Proceed to Battle
      </div>
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
      
      <button onClick={() => triggerBoth()}>C1 Attack!</button>
      <button onClick={() => animation.triggerVFX('C2CritAttack')}>C2 Attack!</button>

      <C1BasicAttack isVisible={doBasicAtkC1} /> {/*card 1*/}
      <C2BasicAttack isVisible={doBasicAtkC2} /> {/*card 2*/}
      <C1CritAttack isVisible={doCritAtkC1}/>
      <C2CritAttack isVisible={doCritAtkC2}/>
      <C1SelfCare isVisible={doSelfCareC1}/>
      <C2SelfCare isVisible={doSelfCareC2}/>

      {/* <BasicAttack isVisible={false}></BasicAttack> */}
      {/* <button onClick={triggerBasicAttack}>Trigger Basic Attack</button>
      {showVFX && (
          <div className={styles.vfx_layer}>
            
          </div>
        )} */}
    </div>
  )
}
