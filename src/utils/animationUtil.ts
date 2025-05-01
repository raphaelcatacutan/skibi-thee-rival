import React from 'react'
import { motion }from 'framer-motion'


const vfxSetters: { [key: string]: (visible: boolean) => void } = {};
let animationSpeed: number = 300;

export function registerVFXSetter(name: string, setter: (visible: boolean) => void) {
  vfxSetters[name] = setter;
}

export function triggerVFX(name: string, duration = animationSpeed) {
  const setter = vfxSetters[name];
  if (setter) {
    setter(true);
    setTimeout(() => setter(false), duration);
  }
}

// card movements
export const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 10, 0],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
  screenshake: {
    x: [0, -20, -10, -20, -10, -20, -10, -20, -10, -20, 0],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
  C1BonkAttack: {
    rotate: [0, , -20, 30],
    transition: {
      duration:0.3,
      ease: "backIn"
    }
  },
  C2BonkAttack: {
    rotate: [0, 20, -30],
    transition: {
      duration:0.3,
      ease: "backIn"
    }
  },
  dmgtext: {
    
  }
};

