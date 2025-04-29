
export function playAudioById(id: string) {
  const audio = document.getElementById(id) as HTMLAudioElement | null;
  if (audio) {
    audio.play();
  } else {
    console.warn(`Audio element with id "${id}" not found.`);
  }
}
