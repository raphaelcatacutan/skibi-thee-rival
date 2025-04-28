import React, { useState } from 'react'
import styling from '../styles/comp-Healthbar.module.css'

interface Props{
  health: number;
  maxHealth: number;
}

export default function Healthbar(props: Props){
  // const [gethealth, sethealth] = useState<number>(0);
  const currHealthPerc = (props.health * 100)/props.maxHealth;


  const computeHealthBarColor = (): string => {
    if (currHealthPerc === 100){
      return "#156430"
    } else if (currHealthPerc >= 75){
      return "#4adb7f"
    } else if (currHealthPerc >= 50){
      return "#f4e903"
    } else if (currHealthPerc >= 25){
      return "#f97215"
    } else if (currHealthPerc >= 10){
      return "#7b231e"
    } else {
      return "#7b231e"; 
    }
  }

  return(
    <div className={styling.health_cont}>
      <div id={styling.health_curr} style={{width: `${currHealthPerc}%`, backgroundColor: computeHealthBarColor()}}>
        {props.health}
      </div>
    </div>
  )
}
