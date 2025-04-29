import React from 'react'
import Lottie from 'lottie-react'
import HardenAnimation from '../../assets/images/shapes/harden.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.HardenC2}>
      <Lottie
        animationData={HardenAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



