import React from 'react'

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


// let setVFXCallback: ((visible: boolean) => void) | null = null;


// export function registerVFXSetter(setter: (visible: boolean) => void) {
//   setVFXCallback = setter;
// }

// export function triggerC1BasicAttack() {
//   if (setVFXCallback) {
//     setVFXCallback(true);

//     setTimeout(() => {
//       setVFXCallback && setVFXCallback(false);
//     }, animationSpeed);
//   }
// }

// export function triggerC2BasicAttack() {
//   if (setVFXCallback) {
//     setVFXCallback(true);

//     setTimeout(() => {
//       setVFXCallback && setVFXCallback(false);
//     }, animationSpeed); // Duration of your VFX animation
//   }
// }