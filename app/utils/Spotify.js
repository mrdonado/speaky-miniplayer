import { remote } from 'electron';
import config from '../config';

const getCredentials = setSpotifyCredentials => {
  const cb = authCode => {
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
    })
      .then(res => res.json())
      .then(setSpotifyCredentials)
      .catch(console.log);
  };
  getAuthCode(cb);
};

const getCurrentTrack = accessToken =>
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(res => res.json());

/**
 * Show a window in order to request user permission to use his/her account.
 * If the access is granted, the one-use access code will be returned to the
 * `cb` callback.
 */
const getAuthCode = cb => {
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
      const authCode = details.url.replace(
        `${config.spotify.redirectUri}?code=`,
        ''
      );
      authWindow.close();
      if (authCode && typeof cb === 'function') {
        cb(authCode);
      }
      callback({ cancel: false });
    }
  );
};

const refreshToken = (token, cb) => {
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
  })
    .then(res => res.json())
    .then(cb)
    .catch(console.log);
};

export default {
  getCredentials,
  getCurrentTrack,
  refreshToken
};
