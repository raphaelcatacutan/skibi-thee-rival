import React from 'react'
import Lottie from 'lottie-react'
import DeluluStrikeAnimation from '../../assets/images/shapes/delulustrike.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.DStrikeC1}>
      <Lottie
        animationData={DeluluStrikeAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



