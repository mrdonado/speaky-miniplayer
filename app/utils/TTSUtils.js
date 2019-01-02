const saySomething = (text, lang = 'en-US') => {
  try {
    const message = new SpeechSynthesisUtterance();
    const voice = speechSynthesis.getVoices().filter(it => it.lang === lang)[2];
    // Apparently when hyphens are present TTS might crash
    message.text = text.replace('-', ' ');
    message.voice = voice;
    speechSynthesis.speak(message);
  } catch (e) {
    console.log(`Error while using TTS: ${e.message}`);
  }
};

export default { saySomething };
