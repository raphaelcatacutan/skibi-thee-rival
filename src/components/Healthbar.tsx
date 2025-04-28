import React, { useState } from 'react'
import styling from '../styles/comp-Healthbar.module.css'

interface Props{
  health: number;
  maxHealth: number;
}

export default function Healthbar(props: Props){
  const [gethealth, sethealth] = useState<number>(0);
  const currHealthPerc = (props.health * 100)/props.maxHealth;
  
  return(
    <div className={styling.health_cont}>
      <div id={styling.health_curr} style={{width: `${currHealthPerc}`}}>
        {props.health}/{props.maxHealth}
      </div>
      
      <div id={styling.health_text}>
        
      </div>
    </div>
  )
}
