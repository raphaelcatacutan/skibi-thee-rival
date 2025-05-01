import React from 'react'
import { motion } from 'framer-motion'
import style from '../../styles/comp-CardDisplay.module.css'
import { shakeAnimation } from '../../utils/animationUtil'

// const shakeAnimation = {
//   shake: {
//     x: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 10, 0],
//     transition: {
//       duration: 1,
//       ease: "easeInOut",
//     },
//   },
// };

export default function(){
  return(
    <motion.div
      className="w-64 h-40 bg-white shadow-lg rounded-xl flex items-center justify-center"
      variants={shakeAnimation}
      animate="shake" 
    >
      Shake Me!
    </motion.div>
  )
}