import React from 'react'
import Lottie from 'lottie-react'
import DiceAnimation from '../../assets/images/shapes/dice.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.DiceC2}>
      <Lottie
        animationData={DiceAnimation}
        loop={false}
        style={{ width: 150, height: 150 }}
      />
    </div>
  )
}



