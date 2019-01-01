// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import styles from './Home.css';
import config from '../config';

const saySomething = (text, lang = 'en-US') => {
  try {
    const message = new SpeechSynthesisUtterance();
    const voice = speechSynthesis.getVoices().filter(it => it.lang === lang)[2];
    message.text = text;
    message.voice = voice;
    speechSynthesis.speak(message);
  } catch (e) {
    console.log(`Error while using TTS: ${e.message}`);
  }
};

const getSpotifyCredentials = setSpotifyCredentials => {
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

const trackToText = track =>
  `You're listening to ${track.item.name}, by ${
    track.item.artists[0].name
  }, from the album ${track.item.album.name}`;

const tellMeNow = accessToken => {
  getCurrentTrack(accessToken)
    .then(res => {
      if (res.error && res.error.message.indexOf('token expired') > -1) {
        console.log('Token expired!!');
        throw new Error('The token expired, a new one will be obtained');
      }
      return res;
    })
    .then(track => saySomething(trackToText(track)))
    .catch(console.log);
};

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
      cb(authCode);
      callback({ cancel: false });
    }
  );
};

const refreshSpotifyToken = (token, cb) => {
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

type Props = {
  home: object,
  setSpotifyCredentials: () => void,
  updateSpotifyAccessToken: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const {
      home,
      setSpotifyCredentials,
      updateSpotifyAccessToken
    } = this.props;
    return (
      <div className={styles.container} data-tid="container">
        <button onClick={() => saySomething('I still work!!!')} type="button">
          Try out the synth speech!
        </button>
        <button
          onClick={() => tellMeNow(home.credentials.spotify.access_token)}
          type="button"
        >
          Inform me now!
        </button>
        <button
          onClick={() => getSpotifyCredentials(setSpotifyCredentials)}
          type="button"
        >
          Get the credentials
        </button>
        <button
          onClick={() => {
            refreshSpotifyToken(
              home.credentials.spotify.refresh_token,
              updateSpotifyAccessToken
            );
          }}
          type="button"
        >
          Refresh token!
        </button>
      </div>
    );
  }
}
