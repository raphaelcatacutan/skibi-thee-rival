interface Props {
  text: string;
  rate?: number;
  pitch?: number;
}

export function speak({ text, rate = 1, pitch = 1 }: Props) {
  const utterance = new SpeechSynthesisUtterance(text);
  const allVoices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
  const italianVoice = allVoices.find((v: SpeechSynthesisVoice) => v.lang === "it-IT");

  if (italianVoice) {
    utterance.voice = italianVoice;
  } else {
    console.warn("No Italian voice found, using default.");
  }

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}