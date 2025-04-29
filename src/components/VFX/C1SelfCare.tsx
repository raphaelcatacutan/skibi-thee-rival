import React from 'react'
import Lottie from 'lottie-react'
import SelfCareAnimation from '../../assets/images/shapes/selfcare.json'
import styles from '../../styles/vfx-Styling.module.css'

interface Props {
  isVisible: boolean;
}

export default function BasicAttack(props: Props){
  if(!props.isVisible){
    return null;
  }

  return(
    <div id={styles.SelfCareC1} >
      <Lottie
        animationData={SelfCareAnimation}
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}



