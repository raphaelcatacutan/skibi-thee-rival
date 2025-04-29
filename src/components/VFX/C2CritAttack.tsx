import React from 'react'
import Lottie from 'lottie-react'
import CritAttackAnimation from '../../assets/images/shapes/catk.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.CritAtkC2} >
      <Lottie
        animationData={CritAttackAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



