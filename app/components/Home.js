// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import styles from './Home.css';
import config from '../config';

// TODO: handle this information in the store
let currentAuthData;
let authCode;

const saySomething = (text, lang = 'en-US') => {
  const message = new SpeechSynthesisUtterance();
  const voice = speechSynthesis.getVoices().filter(it => it.lang === lang)[2];
  message.text = text;
  message.voice = voice;
  speechSynthesis.speak(message);
};

const getAuthorization = () => {
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
};

const getCurrentTrack = () =>
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    method: 'GET',
    headers: { Authorization: `Bearer ${currentAuthData.access_token}` }
  }).then(res => res.json());

const trackToText = track =>
  `You're listening to ${track.item.name}, by ${
    track.item.artists[0].name
  }, from the album ${track.item.album.name}`;

const tellMeNow = () => {
  getCurrentTrack()
    .then(track => saySomething(trackToText(track)))
    .catch(console.log);
};

const getToken = cb => {
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
      authCode = details.url.replace(`${config.spotify.redirectUri}?code=`, '');
      authWindow.close();
      cb(authCode);
      callback({ cancel: false });
    }
  );
};

type Props = {
  home: object,
  refreshCode: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { home, refreshCode } = this.props;
    return (
      <div className={styles.container} data-tid="container">
        <button onClick={() => saySomething('I still work!!!')} type="button">
          Try out the synth speech!
        </button>
        <button onClick={() => tellMeNow()} type="button">
          Inform me now!
        </button>
        <button onClick={() => getToken(refreshCode)} type="button">
          Get the token!!
        </button>
        <button
          onClick={() =>
            getAuthorization()
              .then(authData => {
                currentAuthData = authData;
                return null;
              })
              .catch(console.log)
          }
          type="button"
        >
          Get the Authorization!!
        </button>
        Current Auth {JSON.stringify(home.auth)}
      </div>
    );
  }
}
