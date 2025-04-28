import React from 'react'

let setVFXCallback: ((visible: boolean) => void) | null = null;
let animationSpeed: number = 500;

export function registerVFXSetter(setter: (visible: boolean) => void) {
  setVFXCallback = setter;
}

export function triggerC1BasicAttack() {
  if (setVFXCallback) {
    setVFXCallback(true);

    setTimeout(() => {
      setVFXCallback && setVFXCallback(false);
    }, animationSpeed);
  }
}

export function triggerC2BasicAttack() {
  if (setVFXCallback) {
    setVFXCallback(true);

    setTimeout(() => {
      setVFXCallback && setVFXCallback(false);
    }, animationSpeed); // Duration of your VFX animation
  }
}
// export function triggerVfx(setVfxVisible: React.Dispatch<React.SetStateAction<boolean>>, duration: number = 2000) {
//   setVfxVisible(true);
//   setTimeout(() => {
//     setVfxVisible(false);
//   }, duration);
// }