import notifier from 'node-notifier';
import store from '../store';
import config from '../config';
import TTS from '../utils/TTSUtils';
import Spotify from '../utils/Spotify';
import {
  updateAccessToken,
  updateCurrentTrack,
  updateLastMessage
} from '../actions/home';

let cronjobId;

const trackToText = track =>
  `You're listening to ${track.title}, by ${track.artist}, from the album ${
    track.album
  }`;

const refreshAccessToken = refreshToken => {
  Spotify.refreshToken(refreshToken)
    .then(credentials => store.dispatch(updateAccessToken(credentials)))
    .catch(console.log);
};

const nextMessage = async accessToken => {
  const track = await Spotify.getCurrentTrack(accessToken);
  if (track.error) {
    throw Error(track.error.message);
  }
  store.dispatch(updateCurrentTrack(track));
  return trackToText(track);
};

const cronjobTasks = async () => {
  const state = store.getState();
  // The current service is for now only 'spotify'
  const { currentService, lastMessage } = state.home;
  if (
    !state.home.credentials ||
    !state.home.credentials[currentService] ||
    !state.home.credentials[currentService].refresh_token
  ) {
    console.log('No update will be performed until the app is authorized.');
    return;
  }
  const credentials = state.home.credentials[currentService];
  let message;
  try {
    message = await nextMessage(credentials.access_token);
  } catch (e) {
    if (e.message.indexOf('token') > -1) {
      refreshAccessToken(credentials.refresh_token);
    }
    return;
  }
  if (message !== lastMessage) {
    notifier.notify({
      title: 'Virtual Radio Speaker',
      message,
      icon: false
    });
    TTS.saySomething(message);
    store.dispatch(updateLastMessage(message));
  }
};

const start = () => {
  cronjobId = setInterval(cronjobTasks, config.updateInterval);
};

const stop = () => {
  if (cronjobId) {
    clearInterval(cronjobId);
  }
};

export default {
  start,
  stop
};
