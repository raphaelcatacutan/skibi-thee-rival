import React from 'react'

let setVFXCallback: ((visible: boolean) => void) | null = null;

export function registerVFXSetter(setter: (visible: boolean) => void) {
  setVFXCallback = setter;
}

export function triggerBasicAttack() {
  
  if (setVFXCallback) {
    setVFXCallback(true);

    setTimeout(() => {
      setVFXCallback && setVFXCallback(false);
    }, 1000); // Duration of your VFX animation
  }
}
