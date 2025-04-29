import React, { use, useEffect, useState } from 'react'
import styles from '../styles/page-Battle.module.css'
import Healthbar from '../components/Healthbar' 
import CardDisplay from '../components/CardDisplay'
import * as animation from '../utils/animationUtil'
import C1BasicAttack from '../components/VFX/C1BasicAttack'
import C2BasicAttack from '../components/VFX/C2BasicAttack'
import C1CritAttack from '../components/VFX/C1CritAttack'
import C2CritAttack from '../components/VFX/C2CritAttack'
import C1SelfCare from '../components/VFX/C1SelfCare'
import C2SelfCare from '../components/VFX/C2SelfCare'
import C1DeluluStrike from '../components/VFX/C1DeluluStrike'
import C2DeluluStrike from '../components/VFX/C2DeluluStrike'
import C1Harden from '../components/VFX/C1Harden'
import C2Harden from '../components/VFX/C2Harden'
import C1Zucc from '../components/VFX/C1Zucc'
import C2Zucc from '../components/VFX/C2Zucc'
import C1Punch from '../components/VFX/C1Punch'
import C2Punch from '../components/VFX/C2Punch'
import { time } from 'console'
import { TIMEOUT } from 'dns'

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
  const [doDStrikeC1, setDStrikeC1] = useState(false);
  const [doDStrikeC2, setDStrikeC2] = useState(false);
  const [doHardenC1, setHardenC1] = useState(false);
  const [doHardenC2, setHardenC2] = useState(false);
  const [doZuccC1, setZuccC1] = useState(false);
  const [doZuccC2, setZuccC2] = useState(false);
  const [doPunchC1, setPunchC1] = useState(false);
  const [doPunchC2, setPunchC2] = useState(false);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [doBasicAtkSFX, setBasicAtkSFX] = useState("");
  const [doCritAtkSFX, setCritAtkSFX] = useState("");
  let currHealthC1: number = 0,
      currHealthC2: number = 0;
  let maxHealthC1: number = 0,
      maxHealthC2: number = 0;

  // const batk_audio_cont: string[] = ["batk_1", "batk_2", "batk_3"];
  // const catk_audio_cont: string[] = ["catk_1", "catk_2", "catk_3"];

  // register vfx
  useEffect(() => {
    animation.registerVFXSetter('C1BasicAttack', setBasicAtkC1)
    animation.registerVFXSetter('C2BasicAttack', setBasicAtkC2)
    animation.registerVFXSetter('C1CritAttack', setCritAtkC1)
    animation.registerVFXSetter('C2CritAttack', setCritAtkC2)
    animation.registerVFXSetter('C1Punch', setPunchC1)
    animation.registerVFXSetter('C2Punch', setPunchC2)
    animation.registerVFXSetter('C1DeluluStrike', setDStrikeC1)
    animation.registerVFXSetter('C2DeluluStrike', setDStrikeC2)
    animation.registerVFXSetter('C1SelfCare', setSelfCareC1)
    animation.registerVFXSetter('C2SelfCare', setSelfCareC2)
    animation.registerVFXSetter('C1Harden', setHardenC1)
    animation.registerVFXSetter('C2Harden', setHardenC2)
    animation.registerVFXSetter('C1Zucc', setZuccC1)
    animation.registerVFXSetter('C2Zucc', setZuccC2)
  }, []);

  // for bg music
  useEffect(() => {
    const audio = document.getElementById("bg_music") as HTMLAudioElement;
    if (hasInteracted){
      audio.volume = 0.5;
      audio.play();
    }
  }, [hasInteracted])

  function removeMask(e: React.MouseEvent<HTMLDivElement>){
    e.currentTarget.style.display = 'none';
    setHasInteracted(true);
  }

  function applyHealthChange(index: number, currHealth: number, maxHealth: number){
    if(index == 0){
      currHealthC1 = currHealth;
      maxHealthC1 = maxHealth;
    } else {
      currHealthC2 = currHealth;
      maxHealthC2 = maxHealth;
    }
  }

  function performBAtk(index: number){
    const audio = document.getElementById("batk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1BasicAttack');
    } else {
      animation.triggerVFX('C2BasicAttack');
    }
    audio.play();
  }

  function performPunch(index: number){ // to be revised
    const audio = document.getElementById("punch_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1Punch');
    } else {
      animation.triggerVFX('C2Punch');
    }
    audio.play();
  }

  function performCAtk(index: number){
    const audio = document.getElementById("catk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1CritAttack');
    } else {
      animation.triggerVFX('C2CritAttack');
    }
    audio.play();
  }

  function performBonk(index: number){
    const audio = document.getElementById("bonk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      // c1 animation
    } else {
      // c1 animation
    }
    audio.play();
  }

  function performMaldquake(index: number){
    const audio = document.getElementById("maldquake_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      // c1 animation
    } else {
      // c1 animation
    }
    audio.play();
  }

  function performDeluluStrike(index: number){
    const audio = document.getElementById("delulustrike_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1DeluluStrike');
    } else {
      animation.triggerVFX('C2DeluluStrike');
    }
    audio.play();
  }

  function performSelfCare(index: number){
    const audio = document.getElementById("selfcare_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1SelfCare');
    } else {
      animation.triggerVFX('C2SelfCare');
    }
    audio.play();
  }

  function performHarden(index: number){
    const audio = document.getElementById("harden_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C1Harden');
    } else {
      animation.triggerVFX('C2Harden');
    }
    audio.play();
  }

  function performZucc(index: number){
    const audio = document.getElementById("zucc_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      animation.triggerVFX('C2Zucc');
    } else {
      animation.triggerVFX('C1Zucc');
    }
    audio.play();
  }

  function endBattle(card_id: string){

  }

  // test
  function triggerBoth(){ 
    // animation.triggerVFX('C1BasicAttack', 500);
    animation.triggerVFX('C1BasicAttack');
    setTimeout(() => {
      animation.triggerVFX('C2BasicAttack')
    }, 1000);
  }


  return (
    <div className={styles.background_img}>
      <audio id="bg_music" src="/assets/sounds/battle_bgmusic.mp3" loop={true}/>
      <audio id="catk_sfx" src="/assets/sounds/catk_3.mp3"/>
      <audio id="batk_sfx" src="/assets/sounds/batk_4.mp3"/>
      <audio id="punch_sfx" src="/assets/sounds/punch.mp3"/>
      <audio id="bonk_sfx" src="/assets/sounds/bonk.mp3"/>
      <audio id="maldquake_sfx" src="/assets/sounds/maldquake.mp3"/>
      <audio id="delulustrike_sfx" src="/assets/sounds/delulustrike.mp3"/>
      <audio id="selfcare_sfx" src="/assets/sounds/selfcare.mp3"/>
      <audio id="harden_sfx" src="/assets/sounds/harden.mp3"/>
      <audio id="zucc_sfx" src="/assets/sounds/zucc.mp3"/>
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
          <Healthbar health={currHealthC1} maxHealth={maxHealthC1}></Healthbar>
          <Healthbar health={currHealthC2} maxHealth={maxHealthC2}></Healthbar>
        </div>
      </div>
      
      <button onClick={() => performPunch(0)}>C1 Attack!</button>
      <button onClick={() => performSelfCare(1)}>C2 Attack!</button>

      <C1BasicAttack isVisible={doBasicAtkC1} />
      <C2BasicAttack isVisible={doBasicAtkC2} />
      <C1CritAttack isVisible={doCritAtkC1}/>
      <C2CritAttack isVisible={doCritAtkC2}/>
      <C1Punch isVisible={doPunchC1}/>
      <C2Punch isVisible={doPunchC2}/>
      <C1DeluluStrike isVisible={doDStrikeC1}/>
      <C2DeluluStrike isVisible={doDStrikeC2}/>

      <C1SelfCare isVisible={doSelfCareC1}/>
      <C2SelfCare isVisible={doSelfCareC2}/>
      <C1Harden isVisible={doHardenC1}/>
      <C2Harden isVisible={doHardenC2}/>
      <C1Zucc isVisible={doZuccC1}/>
      <C2Zucc isVisible={doZuccC2}/>


      {/* <BasicAttack isVisible={false}></BasicAttack> */}
      {/* <button onClick={triggerBasicAttack}>Trigger Basic Attack</button>
      {showVFX && (
          <div className={styles.vfx_layer}>
            
          </div>
        )} */}
    </div>
  )
}
