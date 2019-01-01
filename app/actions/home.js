// @flow
// import type { GetState, Dispatch } from '../reducers/types';

export const SET_SPOTIFY_CREDENTIALS = 'SET_SPOTIFY_CREDENTIALS';

export function setSpotifyCredentials(credentials) {
  return {
    credentials,
    type: SET_SPOTIFY_CREDENTIALS
  };
}
