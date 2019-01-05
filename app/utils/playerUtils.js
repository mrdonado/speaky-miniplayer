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
  return APIs[service].play(credentials.access_token);
};

const pause = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  return APIs[service].pause(credentials.access_token);
};

const previous = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  return APIs[service].previous(credentials.access_token);
};

const next = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  return APIs[service].next(credentials.access_token);
};

const getCurrentTrack = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  return APIs[service].getCurrentTrack(credentials.access_token);
};

const refreshToken = state => {
  const service = state.currentService;
  const credentials = state.credentials[service];
  return APIs[service].refreshToken(credentials.refresh_token);
};

export default {
  triggerNotification,
  getCurrentTrack,
  refreshToken,
  play,
  pause,
  previous,
  next
};
