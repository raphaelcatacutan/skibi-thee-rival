import React from 'react'

let setVFXCallback: ((visible: boolean) => void) | null = null;
let animationSpeed: number = 500;

export function registerVFXSetter(setter: (visible: boolean) => void) {
  setVFXCallback = setter;
}

export function triggerBasicAttack() {
  if (setVFXCallback) {
    setVFXCallback(true);

    setTimeout(() => {
      setVFXCallback && setVFXCallback(false);
    }, animationSpeed); // Duration of your VFX animation
  }
}
