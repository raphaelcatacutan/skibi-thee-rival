import React from 'react'
import Lottie from 'lottie-react'
import BasicAttackAnimation from '../../assets/images/shapes/batk.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.BasicAtkC1} >
      <Lottie
        animationData={BasicAttackAnimation}
        loop={false}
        style={{ width: 500, height: 500 }}
      />
    </div>
  )
}



