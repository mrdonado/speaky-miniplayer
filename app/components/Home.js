// @flow
import React, { Component } from 'react';
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
    message.text = text;
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
