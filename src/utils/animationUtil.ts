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