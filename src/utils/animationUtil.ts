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
};

