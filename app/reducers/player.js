// @flow
import {
  SET_CREDENTIALS,
  UPDATE_ACCESS_TOKEN,
  UPDATE_CURRENT_TRACK,
  UPDATE_LAST_MESSAGE
} from '../actions/player';
import type { Action } from './types';

const initialState = {
  credentials: {},
  currentService: 'spotify',
  currentTrack: {},
  lastMessage: '',
  preferences: {
    TTS: true,
    notifications: true
  }
};

export default function player(state = initialState, action: Action) {
  const { musicService } = action;
  let credentials = {};

  switch (action.type) {
    case SET_CREDENTIALS:
      credentials[action.musicService] = action.credentials;
      return Object.assign({}, state, { credentials });

    case UPDATE_ACCESS_TOKEN:
      credentials = Object.assign({}, state.credentials);
      credentials[musicService].access_token = action.access_token;
      return Object.assign({}, state, { credentials });

    case UPDATE_CURRENT_TRACK:
      return Object.assign({}, state, { currentTrack: action.currentTrack });

    case UPDATE_LAST_MESSAGE:
      return Object.assign({}, state, { lastMessage: action.lastMessage });

    default:
      return state;
  }
}
