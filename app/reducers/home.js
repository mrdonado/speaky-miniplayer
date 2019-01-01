// @flow
import { SET_SPOTIFY_CREDENTIALS } from '../actions/home';
import type { Action } from './types';

const initialState = { credentials: {} };

export default function home(state = initialState, action: Action) {
  switch (action.type) {
    case SET_SPOTIFY_CREDENTIALS:
      return Object.assign({}, state, {
        credentials: { spotify: action.credentials }
      });
    default:
      return state;
  }
}
