import React from 'react'

interface Props {
  text: string
}

export function speak(prop: Props){
  const utterance = new SpeechSynthesisUtterance(prop.text);
  // Optional: Customize voice, pitch, rate, etc.
  utterance.rate = 1.7;
  utterance.pitch = 1;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
};