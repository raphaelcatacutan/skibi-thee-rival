import React from 'react';

const Voiceover = () => {
  const textToRead = "BANANA BONK";

  const handleReadText = () => {
    const utterance = new SpeechSynthesisUtterance(textToRead);
    // Optional: Customize voice, pitch, rate, etc.
    utterance.rate = 1.7;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: '20px' }}>
      <p>{textToRead}</p>
      <button onClick={handleReadText}>Play Voiceover</button>
    </div>
  );
};

export default Voiceover;
