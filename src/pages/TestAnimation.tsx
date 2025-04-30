import React, { useState } from 'react'
import CardHolder from '../components/VFX/SampleAnimation'

export default function(){
  const [showClick, setClick] = useState(false);
  
  return(
    <div style={{display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100vw',
                height: '100vh'}}>
      
      <CardHolder/>
      <button style={{position: 'absolute'}}
              onClick={() => {
                setClick(false)
              }}>
        
      </button> 
    </div>
  )
}