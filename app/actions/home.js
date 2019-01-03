// @flow
// import type { GetState, Dispatch } from '../reducers/types';

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';

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
