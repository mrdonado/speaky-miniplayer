import store from '../store';
import config from '../config';
import Spotify from '../utils/Spotify';
import player from '../utils/player';
import {
  updateAccessToken,
  updateCurrentTrack,
  updateLastMessage
} from '../actions/player';

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
  store.dispatch(updateCurrentTrack(track));
  return trackToText(track);
};

const cronjobTasks = async () => {
  const state = store.getState();
  // The current service is for now only 'spotify'
  const { currentService, lastMessage } = state.player;
  if (
    !state.player.credentials ||
    !state.player.credentials[currentService] ||
    !state.player.credentials[currentService].refresh_token
  ) {
    console.log('No update will be performed until the app is authorized.');
    return;
  }
  const credentials = state.player.credentials[currentService];
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
    store.dispatch(updateLastMessage(message));
    player.triggerNotification(store.getState().player);
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
