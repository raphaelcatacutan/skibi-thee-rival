import React from 'react'
import Lottie from 'lottie-react'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
  dice_no: string;
}

export default function DiceCount(props: Props){

  const imgSource: string = "/assets/images/dice_" + props.dice_no + ".png";
  
  if(!props.isVisible){
    return null;
  }

  return(
    <div>
      <img src={imgSource} alt="dice count2" id={styles.DiceCountC2}/>
    </div>
  )
}



