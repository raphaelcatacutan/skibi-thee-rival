import Header from '../components/Header'
import React from 'react'
import styling from '../styles/page-Leaderboards.module.css'


export default function(){
  return(
    <div className={styling.background_img}>
      <Header></Header>
      <h2>Leaderboards</h2>
    </div>
  )
}

