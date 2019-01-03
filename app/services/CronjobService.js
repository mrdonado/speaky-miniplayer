import store from '../store';
import config from '../config';
import TTS from '../utils/TTSUtils';
import Spotify from '../utils/Spotify';
import { updateSpotifyAccessToken } from '../actions/home';

let previousMessage;

let cronjobId;

const trackToText = track =>
  `You're listening to ${track.item.name}, by ${
    track.item.artists[0].name
  }, from the album ${track.item.album.name}`;

const refreshAccessToken = refreshToken => {
  Spotify.refreshToken(refreshToken, credentials => {
    store.dispatch(updateSpotifyAccessToken(credentials));
  });
};

const nextMessage = async accessToken => {
  const track = await Spotify.getCurrentTrack(accessToken);
  if (track.error) {
    throw Error(track.error);
  }
  return trackToText(track);
};

const cronjobTasks = async () => {
  const state = store.getState();
  // The current service is for now only 'spotify'
  const { currentService } = state.home;
  if (!state.home.credentials || !state.home.credentials[currentService]) {
    console.log('No update will be performed until the app is authorized.');
    return;
  }
  const credentials = state.home.credentials[currentService];
  let message;
  try {
    message = await nextMessage(
      credentials.access_token,
      credentials.refresh_token
    );
  } catch (e) {
    // TODO errorHandler(e);
    refreshAccessToken(credentials.refresh_token);
    return;
  }
  if (message !== previousMessage) {
    TTS.saySomething(message);
    previousMessage = message;
  }
};

const start = () => {
  TTS.saySomething('Hello music listener!');
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
