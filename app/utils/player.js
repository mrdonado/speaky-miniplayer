import notifier from 'node-notifier';
import TTS from './TTSUtils';
import Spotify from './Spotify';

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
  Spotify.play(state.credentials[state.currentService].access_token);
};

const pause = state => {
  Spotify.pause(state.credentials[state.currentService].access_token);
};

const previous = state => {
  Spotify.previous(state.credentials[state.currentService].access_token);
};

const next = state => {
  Spotify.next(state.credentials[state.currentService].access_token);
};

export default {
  triggerNotification,
  play,
  pause,
  previous,
  next
};
