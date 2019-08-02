// @flow
import {
  SET_CREDENTIALS,
  UPDATE_ACCESS_TOKEN,
  UPDATE_CURRENT_TRACK,
  UPDATE_LAST_MESSAGE,
  UPDATE_PREFERENCE,
  UPDATE_DEVICES_LIST,
  UPDATE_LAST_ACTIVE_DEVICE,
  SET_PLAYING_STATUS,
  LOGOUT
} from '../actions/player';
import type { Action } from './types';

const initialState = {
  credentials: {},
  currentService: 'spotify',
  currentTrack: {
    title: '',
    album: '',
    artist: '',
    coverArt: '',
    playing: false
  },
  lastMessage: '',
  preferences: {
    TTS: true,
    notifications: true,
    alwaysOnTop: true
  },
  devices: null,
  lastActiveDevice: null
};

export default function player(state = initialState, action: Action) {
  const { musicService } = action;
  const { preferences } = Object.assign({}, state);
  const { currentTrack } = Object.assign({}, state);
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

    case UPDATE_LAST_ACTIVE_DEVICE:
      return Object.assign({}, state, {
        lastActiveDevice: action.lastActiveDevice
      });

    case UPDATE_PREFERENCE:
      preferences[action.preference] = action.value;
      return Object.assign({}, state, { preferences });

    case UPDATE_DEVICES_LIST:
      return Object.assign({}, state, { devices: action.devices });

    case SET_PLAYING_STATUS:
      currentTrack.playing = action.playing;
      return Object.assign({}, state, currentTrack);

    case LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
}
