import { ipcRenderer } from 'electron';

import playerUtils from '../utils/playerUtils';

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';
export const UPDATE_CURRENT_TRACK = 'UPDATE_CURRENT_TRACK';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';

// When an API has been called, a small amount of time will be
// required until the next API call has the latest information.
const DEBOUNCE_TIME = 100;

export const updateLastMessage = lastMessage => ({
  lastMessage,
  type: UPDATE_LAST_MESSAGE
});

export const setCredentials = (credentials, musicService = 'spotify') => ({
  credentials,
  musicService,
  type: SET_CREDENTIALS
});

export const updateAccessToken = (credentials, musicService = 'spotify') => ({
  musicService,
  type: UPDATE_ACCESS_TOKEN,
  access_token: credentials.access_token
});

const trackToText = track =>
  `You're listening to ${track.title}, by ${track.artist}, from the album ${
    track.album
  }`;

export const updateCurrentTrack = currentTrack => (dispatch, getState) => {
  const { lastMessage } = getState().player;
  const newMessage = trackToText(currentTrack);
  dispatch({
    currentTrack,
    type: UPDATE_CURRENT_TRACK
  });
  if (newMessage !== lastMessage) {
    dispatch(updateLastMessage(newMessage));
    playerUtils.triggerNotification(getState().player);
  }
};

export const errorHandler = e => (dispatch, getState) => {
  const { player } = getState();

  if (e.message.indexOf('token') >= -1) {
    playerUtils
      .refreshToken(player)
      .then(credentials => dispatch(updateAccessToken(credentials)))
      .catch(console.log);
  } else {
    // Unknown error
    console.warn(e);
  }
};

export const getCurrentTrack = () => (dispatch, getState) => {
  const { player } = getState();
  playerUtils
    .getCurrentTrack(player)
    .then(track => dispatch(updateCurrentTrack(track)))
    .catch(e => dispatch(errorHandler(e)));
};

export const playerAction = action => (dispatch, getState) => {
  const { player } = getState();
  playerUtils[action](player)
    .then(() => setTimeout(() => dispatch(getCurrentTrack()), DEBOUNCE_TIME))
    .catch(e => dispatch(errorHandler(e)));
};

export const next = () => playerAction('next');
export const previous = () => playerAction('previous');
export const play = () => playerAction('play');
export const pause = () => playerAction('pause');

export const swapAlwaysOnTop = () => () =>
  ipcRenderer.send('swap-always-on-top');

export const triggerNotification = () => (dispatch, getState) => {
  const { player } = getState();
  playerUtils.triggerNotification(player);
};
