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

const refreshToken = _refreshToken => {
  Spotify.refreshSpotifyToken(_refreshToken, credentials => {
    store.dispatch(updateSpotifyAccessToken(credentials));
  });
};

const nextMessage = async (accessToken, _refreshToken) => {
  const track = await Spotify.getCurrentTrack(accessToken);
  if (track.error && track.error.message.indexOf('token') > -1) {
    refreshToken(_refreshToken);
    // TODO: throw Error('The access token was not valid');
    return previousMessage;
  }
  return trackToText(track);
};

const cronjobTasks = async () => {
  const state = store.getState();
  if (!state.home.credentials || !state.home.credentials.spotify) {
    console.log('No update will be performed until the app is authorized.');
    return;
  }
  const message = await nextMessage(
    state.home.credentials.spotify.access_token,
    state.home.credentials.spotify.refresh_token
  );
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
