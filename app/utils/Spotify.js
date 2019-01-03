import { remote } from 'electron';
import config from '../config';

/**
 * It returns a promise that resolves to the spotify credentials:
 *
 * ```
 * {
 *   access_token: '...',
 *   token_type: 'Bearer',
 *   expires_in: 3600,
 *   refresh_token: '...',
 *   scope: '...'
 * }
 * ```
 *
 */
const getCredentials = () =>
  getAuthCode().then(authCode => {
    // With the one-use `authCode` we retrieve now the credentials,
    // containing an `access_token` and a `refresh_token`.

    const body = new URLSearchParams();

    body.append('grant_type', 'authorization_code');
    body.append('code', authCode);
    body.append('redirect_uri', config.spotify.redirectUri);
    body.append('client_id', config.spotify.clientId);
    body.append('client_secret', config.spotify.spotifyClientSecret);

    const bstr = body.toString();

    return fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bstr
    }).then(res => res.json());
  });

const spotifyTrackToGenericMap = track => ({
  title: track.item.name,
  album: track.item.album.name,
  artist: track.item.artists[0].name,
  coverArt: track.item.album.images[0].url,
  playing: track.is_playing
});

/**
 * It returns a promise with the track currently being played
 */
const getCurrentTrack = accessToken =>
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(res => res.json())
    .then(spotifyTrackToGenericMap);

/**
 * This is a private (not exported) function.
 *
 * `getAuthCode` is the same function as `getAuthCodeCb` but instead of
 * requiring a callback, it returns a promise that resolves to the
 * authorization code if it has been granted or that will be rejected
 * otherwise.
 */
const getAuthCode = () =>
  new Promise((resolve, reject) => {
    try {
      getAuthCodeCb(resolve);
    } catch (e) {
      reject(e);
    }
  });

/**
 * This is a private (not exported) function.
 *
 * Show a window in order to request user permission to use his/her account.
 * If the access is granted, the one-use access code will be returned to the
 * `cb` callback.
 */
const getAuthCodeCb = cb => {
  const authWindow = new remote.BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
    'web-security': false
  });

  const authUrl = `https://accounts.spotify.com/en/authorize?client_id=${
    config.spotify.clientId
  }&response_type=code&redirect_uri=${encodeURIComponent(
    config.spotify.redirectUri
  )}&scope=${encodeURI(config.spotify.scopes)}`;

  authWindow.loadURL(authUrl);

  authWindow.show();

  authWindow.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [`${config.spotify.redirectUri}*`]
    },
    (details, callback) => {
      if (details.url.indexOf('?code=') > -1) {
        cb(details.url.replace(`${config.spotify.redirectUri}?code=`, ''));
      } else {
        throw new Error('No authorization has been granted.');
      }

      authWindow.close();
      callback({ cancel: false });
    }
  );
};

/**
 * It returns a promise that resolves to a new `access_token`,
 * given a known `refresh_token`.
 */
const refreshToken = token => {
  const body = new URLSearchParams();

  body.append('grant_type', 'refresh_token');
  body.append('refresh_token', token);
  body.append('client_id', config.spotify.clientId);
  body.append('client_secret', config.spotify.spotifyClientSecret);

  const bstr = body.toString();

  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bstr
  }).then(res => res.json());
};

export default {
  getCredentials,
  getCurrentTrack,
  refreshToken
};
