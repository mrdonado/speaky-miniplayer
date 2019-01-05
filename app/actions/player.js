// @flow
import type { GetState, Dispatch } from '../reducers/types';
import playerUtils from '../utils/playerUtils';

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';
export const UPDATE_CURRENT_TRACK = 'UPDATE_CURRENT_TRACK';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';

export function updateCurrentTrack(currentTrack) {
  return {
    currentTrack,
    type: UPDATE_CURRENT_TRACK
  };
}

export function updateLastMessage(lastMessage) {
  return {
    lastMessage,
    type: UPDATE_LAST_MESSAGE
  };
}

export function setCredentials(credentials, musicService = 'spotify') {
  return {
    credentials,
    musicService,
    type: SET_CREDENTIALS
  };
}

export function updateAccessToken(credentials, musicService = 'spotify') {
  return {
    musicService,
    type: UPDATE_ACCESS_TOKEN,
    access_token: credentials.access_token
  };
}

export function next() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { player } = getState();

    playerUtils.next(player);

    // dispatch(increment());
  };
}
