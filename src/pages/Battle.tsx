import React, { use, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Scene from '../components/Scene'
import TextMask from '../components/TextMask'
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
import C1Dice from '../components/VFX/C1Dice'
import C2Dice from '../components/VFX/C2Dice'
import C1DiceCount from '../components/VFX/C1DiceCount'
import C2DiceCount from '../components/VFX/C2DiceCount'
import MiddleText from '../components/VFX/MiddleText'
import C1TopText from '../components/VFX/C1TopText'
import C2TopText from '../components/VFX/C2TopText'
import C1SideText from '../components/VFX/C1SideText'
import C2SideText from '../components/VFX/C2SideText'
import C1BonkAttack from '../components/VFX/C1BonkAttack'
import C2BonkAttack from '../components/VFX/C2BonkAttack'
import { Navigate, useNavigate, useNavigation, useSearchParams } from 'react-router-dom'
import {speak} from '../utils/ttsUtil'
import { jsonToCards } from '../utils/parser'
import { startBattle } from '../utils/battle_sequence'

export default function Battle(){
  const [getScene, setScene] = useState("");

  const [doDiceCountC1, setDiceCountC1] = useState(false);
  const [doDiceCountC2, setDiceCountC2] = useState(false);
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
  const [doBonkC1, setBonkC1] = useState(false);
  const [doBonkC2, setBonkC2] = useState(false);
  const [doScreenShake, setScreenShake] = useState(false);
  const [doDiceC1, setDiceC1] = useState(false);
  const [doDiceC2, setDiceC2] = useState(false);
  const [doMiddleText, setMiddleText] = useState(false);
  const [showMiddleTextString, setMiddleTextString] = useState("");
  const [doC1TopText, setC1TopText] = useState(false);
  const [doC2TopText, setC2TopText] = useState(false);
  const [showC1TopTextString, setC1TopTextString] = useState("");
  const [showC2TopTextString, setC2TopTextString] = useState("");
  const [showC1TopTextColor, setC1TopTextColor] = useState("");
  const [showC2TopTextColor, setC2TopTextColor] = useState("");
  const [doC1SideText, setC1SideText] = useState(false);
  const [doC2SideText, setC2SideText] = useState(false);
  const [showC1SideTextString, setC1SideTextString] = useState("");
  const [showC2SideTextString, setC2SideTextString] = useState("");
  const [showC1SideTextColor, setC1SideTextColor] = useState("");
  const [showC2SideTextColor, setC2SideTextColor] = useState("");

  var [showDiceCountValC1, setDiceCountValC1] = useState("1");
  var [showDiceCountValC2, setDiceCountValC2] = useState("1");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showScreenMask, setScreenMask] = useState(true);
  const [isReady, setisReady] = useState(true);
  const [isStart, setisStart] = useState(false)
  const [isDraw, setisDraw] = useState(false);
  const [isFinished, setisFinished] = useState(false);

  // const [showMessage, setMessage] = useState("READY");
	const [searchParams] = useSearchParams();
	const card1 = searchParams.get("card1") || "";
	const card2 = searchParams.get("card2") || "";
  const [C1isAttacked, C1setAttacked] = useState(false);
  const [C2isAttacked, C2setAttacked] = useState(false);
  var cardC1: string = `http://localhost:5000/output/${card1}-preview.png`
  var cardC2: string = `http://localhost:5000/output/${card2}-preview.png`
  console.log(cardC1)

      
  const [currHealthC1, setCurrHealthC1] = useState(1);
  const [currHealthC2, setCurrHealthC2] = useState(1);
  const [maxHealthC1, setMaxHealthC1] = useState(1);
  const [maxHealthC2, setMaxHealthC2] = useState(1);
  let speedControl: number = 500;
  const navigate = useNavigate()
  const bg_scenes: string[] = [];

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
    animation.registerVFXSetter('C1Dice', setDiceC1)
    animation.registerVFXSetter('C2Dice', setDiceC2)
    animation.registerVFXSetter('C1DiceCount', setDiceCountC1)
    animation.registerVFXSetter('C2DiceCount', setDiceCountC2)
    animation.registerVFXSetter('MiddleText', setMiddleText)
    animation.registerVFXSetter('C1TopText', setC1TopText)
    animation.registerVFXSetter('C2TopText', setC2TopText)
    animation.registerVFXSetter('C1SideText', setC1SideText)
    animation.registerVFXSetter('C2SideText', setC2SideText)
    animation.registerVFXSetter('C1BonkAttack', setBonkC1)
    animation.registerVFXSetter('C2BonkAttack', setBonkC2)
  }, []);

  const triggerScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 600);
  };

  const C1triggerShake = () => {
    C1setAttacked(true);
    setTimeout(() => C1setAttacked(false), 600);
  };

  const C2triggerShake = () => {
    C2setAttacked(true);
    setTimeout(() => C2setAttacked(false), 600); // match animation duration
  };

  function introCards(card1: string, card2: string) {
    setTimeout(() => {
      speak({text: "."})
    }, 200);
    setTimeout(() => speak({ text: card1, pitch: 1.3, rate: 1.1 })); // Higher pitch for name emphasis
    setTimeout(() => {
      speak({ text: "versus", pitch: 0.8, rate: 0.9 }); // Lower pitch for contrast
    }, 300);
    setTimeout(() => {
      speak({ text: card2, pitch: 1.3, rate: 1.1 });
    }, 600);
    setTimeout(() => {
      speak({ text: "FIGHT!", pitch: 1.5, rate: 1.2 });
    }, 900);
  }

  function removeMask(e: React.MouseEvent<HTMLDivElement>){
    setisReady(false);
    setisStart(true);
    speak({text: "..."})
    introCards("Robante Balante", "Saging Bading")
    setTimeout(() => {
      setisStart(false);
      setHasInteracted(true)
      setScreenMask(false)
    }, 7000)

    e.currentTarget.style.display = 'none';
    setHasInteracted(true);
    
    fetch(`http://localhost:3000/api/images?filter=${card1}&filter=${card2}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      const cards = jsonToCards(data)
      const card1Info = cards[card1]
      const card2Info = cards[card2]
  
      startBattle(
        card1,
        card2,
        card1Info,
        card2Info,
        performBAtk,
        performPunch,
        performCAtk,
        performBonk,
        performMaldquake,
        performDeluluStrike,
        performSelfCare,
        performHarden,
        performZucc,
        applyHealthChange,
        endBattle,
        performDiceRoll
      )
    })
    .catch((err) => {
      console.error("Failed to fetch image config", err);
    });
  }

  function applyHealthChange(index: number, currHealth: number, maxHealth: number){
    if(index == 0){
      setCurrHealthC1(currHealth)
      setMaxHealthC1(maxHealth)
    } else {
      setCurrHealthC2(currHealth)
      setMaxHealthC2(maxHealth)
    }
  }

  function performDiceRoll(C1_dice: number, C2_dice: number, turn: string = "Card 1 First"){
    const audio = document.getElementById("dice_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    animation.triggerVFX('C1Dice', 2000);
    animation.triggerVFX('C2Dice', 2000);
    setDiceCountValC1(C1_dice.toString());
    setDiceCountValC2(C2_dice.toString());
    audio.play();
    setTimeout(() => {
      setMiddleTextString(turn);
      animation.triggerVFX('C1DiceCount', 1000)
      animation.triggerVFX('C2DiceCount', 1000);
    }, 1000)
    setTimeout(() => {
      animation.triggerVFX('MiddleText', 1500);
    }, 1000)
  }

  function performBAtk(index: number, dmg: number = 500){
    const audio = document.getElementById("batk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC2SideTextString(dmg.toString());
      setC2SideTextColor("#ff0000");
      animation.triggerVFX('C1BasicAttack');
      animation.triggerVFX('C2SideText', speedControl);
    } else {
      setC1SideTextString(dmg.toString())
      setC1SideTextColor("#ff0000")
      animation.triggerVFX('C2BasicAttack');
      animation.triggerVFX('C1SideText', speedControl);
    }
    audio.play();
  }
  
  function performCAtk(index: number, dmg: number){
    const audio = document.getElementById("catk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC2TopTextString("Critical!")
      setC2SideTextString(dmg.toString())
      setC2SideTextColor("#ff0000")
      animation.triggerVFX('C2SideText', speedControl);
      animation.triggerVFX('C2TopText', speedControl);
      animation.triggerVFX('C1CritAttack');
      // C2triggerShake() redundant
    } else {
      setC1TopTextString("Critical!")
      setC1SideTextString(dmg.toString())
      setC1SideTextColor("#ff0000")
      animation.triggerVFX('C1SideText', speedControl);
      animation.triggerVFX('C1TopText', speedControl);
      animation.triggerVFX('C2CritAttack');
      // C1triggerShake() redundant
    }
    triggerScreenShake();
    audio.play();
  }

  function performPunch(index: number, skillname: string, dmg: number){
    const audio = document.getElementById("punch_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      setC2SideTextString(dmg.toString())
      setC2SideTextColor("#ff0000")
      animation.triggerVFX('C1TopText', speedControl)
      animation.triggerVFX('C2SideText', speedControl)
      animation.triggerVFX('C1Punch');
    } else {
      setC2TopTextString(skillname)
      setC1SideTextString(dmg.toString())
      setC1SideTextColor("#ff0000")
      animation.triggerVFX('C2TopText', speedControl)
      animation.triggerVFX('C1SideText', speedControl)
      animation.triggerVFX('C2Punch');
    }
    audio.play();
  }

  function performBonk(index: number, skillname: string, dmg: number){
    const audio = document.getElementById("bonk_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      setC2SideTextString(dmg.toString())
      setC2SideTextColor("#ff0000")
      animation.triggerVFX('C1TopText', speedControl)
      animation.triggerVFX('C1BonkAttack')
      setTimeout(() => animation.triggerVFX('C2SideText', speedControl), 300)
    } else {
      setC2TopTextString(skillname)
      setC1SideTextString(dmg.toString())
      setC1SideTextColor("#ff0000")
      animation.triggerVFX('C2TopText', speedControl)
      animation.triggerVFX('C2BonkAttack')
      setTimeout(() => animation.triggerVFX('C1SideText', speedControl), 300)
    }
    setTimeout(() => 
      audio.play(), 90
    )
  }

  function performMaldquake(index: number, skillname: string, dmgtoC1: number, dmgtoC2: number){
    const audio = document.getElementById("maldquake_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      animation.triggerVFX('C1TopText', speedControl)
    } else {
      setC2TopTextString(skillname)
      animation.triggerVFX('C2TopText', speedControl)
    }
    setC1SideTextString(dmgtoC1.toString())
    setC1SideTextColor("#ff0000")
    setC2SideTextString(dmgtoC2.toString())
    setC2SideTextColor("#ff0000")
    animation.triggerVFX('C1SideText', speedControl)
    animation.triggerVFX('C2SideText', speedControl)
    C1triggerShake()
    C2triggerShake()
    triggerScreenShake()
    audio.play();
  }

  function performDeluluStrike(index: number, skillname: string){
    const audio = document.getElementById("delulustrike_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      animation.triggerVFX('C1TopText', speedControl)
      animation.triggerVFX('C2DeluluStrike');
    } else {
      setC2TopTextString(skillname)
      animation.triggerVFX('C2TopText', speedControl)
      animation.triggerVFX('C1DeluluStrike');
    }
    audio.play();
  }

  function performSelfCare(index: number, skillname: string, heal: number){
    const audio = document.getElementById("selfcare_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1SideTextString(heal.toString())
      setC1SideTextColor("#FF98FB98")
      animation.triggerVFX('C1SideText', speedControl)
      animation.triggerVFX('C1SelfCare');
    } else {
      setC2SideTextString(heal.toString())
      setC2SideTextColor("#FF98FB98")
      animation.triggerVFX('C2SideText', speedControl)
      animation.triggerVFX('C2SelfCare');
    }
    audio.play();
  }

  function performHarden(index: number, skillname: string){
    const audio = document.getElementById("harden_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      animation.triggerVFX('C1TopText', speedControl)
      animation.triggerVFX('C1Harden', speedControl);
    } else {
      setC2TopTextString(skillname)
      animation.triggerVFX('C2TopText', speedControl)
      animation.triggerVFX('C2Harden', speedControl);
    }
    audio.play();
  }

  function performZucc(index: number, skillname: string){
    const audio = document.getElementById("zucc_sfx") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();
    if (index == 0){
      setC1TopTextString(skillname)
      animation.triggerVFX('C1TopText', speedControl)
      animation.triggerVFX('C2Zucc', speedControl);
    } else {
      setC2TopTextString(skillname)
      animation.triggerVFX('C2TopText', speedControl)
      animation.triggerVFX('C1Zucc', speedControl);
    }
    audio.play();
  }

  function endBattle(card_id: string|undefined, isDraw: boolean){
    if (isDraw){ // if may draw
      setisDraw(true)
      setHasInteracted(false)
      setTimeout(() => setisDraw(false), 3000)
    } else { // if walang draw
      setisFinished(true)
      setHasInteracted(false)
      setTimeout(() => {
        setisFinished(false)
        navigate(`/Winner?id=${card_id}`)
      }, 3000)
    }
  }

  return (
    <div className={styles.background_cont}>
      <Scene quake={doScreenShake} playMusic={hasInteracted}></Scene>
      <audio id="dice_sfx" src="/assets/sounds/dice.mp3"/>
      <audio id="catk_sfx" src="/assets/sounds/catk_3.mp3"/>
      <audio id="batk_sfx" src="/assets/sounds/batk_4.mp3"/>
      <audio id="punch_sfx" src="/assets/sounds/punch.mp3"/>
      <audio id="bonk_sfx" src="/assets/sounds/bonk1.mp3"/>
      <audio id="maldquake_sfx" src="/assets/sounds/maldquake.mp3"/>
      <audio id="delulustrike_sfx" src="/assets/sounds/delulustrike.mp3"/>
      <audio id="selfcare_sfx" src="/assets/sounds/selfcare.mp3"/>
      <audio id="harden_sfx" src="/assets/sounds/harden.mp3"/>
      <audio id="zucc_sfx" src="/assets/sounds/zucc.mp3"/>
      {showScreenMask && (
      <div className={styles.mask_layer} onClick={removeMask}>
        <TextMask isVisible={isReady} message={"READY"} font="ready"/>
        <TextMask isVisible={isStart} message={"FIGHT"} font="fight"/>
      </div>)}
      {isDraw && (
      <div className={styles.mask_layer} >
        <TextMask isVisible={isDraw} message={"DRAW"} font="ready"/>
      </div>)}
      {isFinished && (
      <div className={styles.mask_layer} >
        <TextMask isVisible={isFinished} message={"FINISHED"} font="ready"/>
      </div>)}

      <div id={styles.round_text}>Round 1</div>
      <div id={styles.battle_area}>
        <div id={styles.card_cont}>
          <CardDisplay path={cardC1} attackedState={C1isAttacked}></CardDisplay>
          <CardDisplay path={cardC2} attackedState={C2isAttacked}></CardDisplay>
        </div>
        <div id={styles.heart_cont}>          
          <Healthbar health={currHealthC1} maxHealth={maxHealthC1}></Healthbar>
          <Healthbar health={currHealthC2} maxHealth={maxHealthC2}></Healthbar>
        </div>
      </div>
      
      {/* <button style={{backgroundColor: 'transparent'}} onClick={() => {performZucc(1, "SELF-CARE BONK")}}>C1 Attack!</button>
      <button style={{backgroundColor: 'transparent'}} onClick={() => {performZucc(1, "LANGKAQUAKE")}}>C2 Attack!</button> */}

      <C1DiceCount isVisible={doDiceCountC1} dice_no={showDiceCountValC1}/>
      <C2DiceCount isVisible={doDiceCountC2} dice_no={showDiceCountValC2}/>
      <C1Dice isVisible={doDiceC1}></C1Dice>
      <C2Dice isVisible={doDiceC2}></C2Dice>
      <C1BasicAttack isVisible={doBasicAtkC1} />
      <C2BasicAttack isVisible={doBasicAtkC2} />
      <C1CritAttack isVisible={doCritAtkC1}/>
      <C2CritAttack isVisible={doCritAtkC2}/>
      <C1Punch isVisible={doPunchC1}/>
      <C2Punch isVisible={doPunchC2}/>
      <C1BonkAttack isVisible={doBonkC1}/>
      <C2BonkAttack isVisible={doBonkC2}/>
      <C1DeluluStrike isVisible={doDStrikeC1}/>
      <C2DeluluStrike isVisible={doDStrikeC2}/>

      <C1SelfCare isVisible={doSelfCareC1}/>
      <C2SelfCare isVisible={doSelfCareC2}/>
      <C1Harden isVisible={doHardenC1}/>
      <C2Harden isVisible={doHardenC2}/>
      <C1Zucc isVisible={doZuccC1}/>
      <C2Zucc isVisible={doZuccC2}/>
      <MiddleText isVisible={doMiddleText} text={showMiddleTextString}/>
      <C1TopText isVisible={doC1TopText} text={showC1TopTextString}/>
      <C2TopText isVisible={doC2TopText} text={showC2TopTextString}/>
      <C1SideText isVisible={doC1SideText} text={showC1SideTextString} color={showC1SideTextColor}/>
      <C2SideText isVisible={doC2SideText} text={showC2SideTextString} color={showC2SideTextColor}/>
      {/* <BasicAttack isVisible={false}></BasicAttack> */}
      {/* <button onClick={triggerBasicAttack}>Trigger Basic Attack</button>
      {showVFX && (
          <div className={styles.vfx_layer}>
            
          </div>
        )} */}
    </div>
  )
}
