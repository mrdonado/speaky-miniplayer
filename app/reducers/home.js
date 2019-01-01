// @flow
import {
  SET_SPOTIFY_CREDENTIALS,
  UPDATE_SPOTIFY_ACCESS_TOKEN
} from '../actions/home';
import type { Action } from './types';

const initialState = { credentials: {} };

const updateOneKey = (oldObject, key, value) => {
  const newObject = Object.assign({}, oldObject);
  newObject[key] = value;
  return newObject;
};

export default function home(state = initialState, action: Action) {
  switch (action.type) {
    case SET_SPOTIFY_CREDENTIALS:
      return Object.assign({}, state, {
        credentials: { spotify: action.credentials }
      });
    case UPDATE_SPOTIFY_ACCESS_TOKEN:
      return Object.assign({}, state, {
        credentials: {
          spotify: updateOneKey(
            state.credentials.spotify,
            'access_token',
            action.access_token
          )
        }
      });
    default:
      return state;
  }
}
