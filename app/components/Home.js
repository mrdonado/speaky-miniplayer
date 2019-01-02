// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Home.css';
import {
  getCurrentTrack,
  getSpotifyCredentials,
  refreshSpotifyToken
} from '../utils/spotify-tools';

const saySomething = (text, lang = 'en-US') => {
  try {
    const message = new SpeechSynthesisUtterance();
    const voice = speechSynthesis.getVoices().filter(it => it.lang === lang)[2];
    // Apparently when hyphens are present TTS might crash
    message.text = text.replace('-', ' ');
    message.voice = voice;
    speechSynthesis.speak(message);
  } catch (e) {
    console.log(`Error while using TTS: ${e.message}`);
  }
};

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
    const isAuthorized = !!home.credentials.spotify;
    if (!isAuthorized) {
      return (
        <div>
          {
            "So that the virtual radio speaker knows what you're listening to, you first need to connect the app to your Spotify account."
          }
          <button
            onClick={() => getSpotifyCredentials(setSpotifyCredentials)}
            type="button"
          >
            Connect now
          </button>
        </div>
      );
    }
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
        <button
          type="button"
          onClick={() => ipcRenderer.send('swap-always-on-top')}
        >
          Swap always on top
        </button>
      </div>
    );
  }
}
