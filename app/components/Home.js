// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Home.css';
import Spotify from '../utils/Spotify';
import TTSUtils from '../utils/TTSUtils';

type Props = {
  home: object,
  setSpotifyCredentials: () => void
};

const callUpdateService = () => {
  // former tellMeNow(home.credentials.spotify.access_token)
  console.log('TODO!');
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { home, setSpotifyCredentials } = this.props;
    const isAuthorized = !!home.credentials.spotify;
    if (!isAuthorized) {
      return (
        <div>
          {
            "So that the virtual radio speaker knows what you're listening to, you first need to connect the app to your Spotify account."
          }
          <button
            onClick={() => Spotify.getSpotifyCredentials(setSpotifyCredentials)}
            type="button"
          >
            Connect now
          </button>
        </div>
      );
    }
    return (
      <div className={styles.container} data-tid="container">
        <button
          onClick={() => TTSUtils.saySomething('I still work!!!')}
          type="button"
        >
          Try out the synth speech!
        </button>

        <button onClick={callUpdateService} type="button">
          Inform me now!
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
