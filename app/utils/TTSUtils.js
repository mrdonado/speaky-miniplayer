let voicesReady = false;

const errorCallback = e => {
  console.log(`TTS error: ${e.message}`);
  speechSynthesis.cancel();
};

speechSynthesis.onerror = errorCallback;

speechSynthesis.onvoiceschanged = () => {
  console.log(`Voices #: ${speechSynthesis.getVoices().length}`);
  speechSynthesis.getVoices().forEach(voice => {
    console.log(voice.name, voice.lang);
  });
  voicesReady = true;
};

const saySomething = (text = '', lang = 'en-AU') => {
  if (!voicesReady) return;
  const message = new SpeechSynthesisUtterance();
  message.onerror = errorCallback;
  const voices = speechSynthesis.getVoices().filter(it => it.lang === lang);
  // Apparently some characters make the TTS engine crash,
  // so we'll replace them now
  message.text = text.replace(/([\d]{4})[-\s]*([\d]{4})/g, "$1' $2'");
  message.text = message.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  message.text = message.text.replace(/[-()[]]*/g, '');
  message.text = message.text.replace(/[\s]{2}/g, ' ');
  [message.voice] = voices;
  message.volume = 1;
  message.rate = 0.85;
  // message.pitch = 1;
  speechSynthesis.speak(message);
};

export default { saySomething };
