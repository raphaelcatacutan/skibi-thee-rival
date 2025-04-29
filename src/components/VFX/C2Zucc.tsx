import React from 'react'
import Lottie from 'lottie-react'
import ZuccAnimation from '../../assets/images/shapes/zucc.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.ZuccC2}>
      <Lottie
        animationData={ZuccAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



