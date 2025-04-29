import React from 'react'
import Lottie from 'lottie-react'
import PunchAnimation from '../../assets/images/shapes/punch.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.PunchC2}>
      <Lottie
        animationData={PunchAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



