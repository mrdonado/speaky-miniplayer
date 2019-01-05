import notifier from 'node-notifier';
import TTS from './TTSUtils';
import spotify from './Spotify';

const APIs = { spotify };

const triggerNotification = state => {
  if (state.preferences.notifications) {
    notifier.notify({
      title: 'Virtual Radio Speaker',
      message: state.lastMessage,
      icon: false,
      wait: false,
      timeout: 5
    });
  }
  if (state.preferences.TTS) {
    TTS.saySomething(state.lastMessage);
  }
};

const play = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  APIs[service].play(credentials.access_token);
};

const pause = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  APIs[service].pause(credentials.access_token);
};

const previous = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  APIs[service].previous(credentials.access_token);
};

const next = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  APIs[service].next(credentials.access_token);
};

export default {
  triggerNotification,
  play,
  pause,
  previous,
  next
};
