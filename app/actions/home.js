// @flow
// import type { GetState, Dispatch } from '../reducers/types';

export const SET_SPOTIFY_CREDENTIALS = 'SET_SPOTIFY_CREDENTIALS';
export const UPDATE_SPOTIFY_ACCESS_TOKEN = 'UPDATE_SPOTIFY_ACCESS_TOKEN';

export function setSpotifyCredentials(credentials) {
  return {
    credentials,
    type: SET_SPOTIFY_CREDENTIALS
  };
}

export function updateSpotifyAccessToken(credentials) {
  return {
    type: UPDATE_SPOTIFY_ACCESS_TOKEN,
    access_token: credentials.access_token
  };
}
