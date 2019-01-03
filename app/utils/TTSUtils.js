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

const saySomething = (text = '', lang = 'en-US') => {
  if (!voicesReady) return;
  const message = new SpeechSynthesisUtterance();
  message.onerror = errorCallback;
  const voice =
    speechSynthesis.getVoices().filter(it => it.lang === lang)[2] || 'native';
  // Apparently some characters make the TTS engine crash,
  // so we'll replace them now
  message.text = text.replace(/([\d]{4})[-\s]*([\d]{4})/g, "$1' $2'");
  message.text = message.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  message.voice = voice;
  message.volume = 1;
  message.rate = 0;
  message.pitch = 0;
  speechSynthesis.speak(message);
};

export default { saySomething };
