import playerUtils from '../utils/playerUtils';

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';
export const UPDATE_CURRENT_TRACK = 'UPDATE_CURRENT_TRACK';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';

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

export const next = () => (dispatch, getState) => {
  const { player } = getState();
  playerUtils
    .next(player)
    .then(() => setTimeout(() => dispatch(getCurrentTrack()), 200))
    .catch(e => dispatch(errorHandler(e)));
};
