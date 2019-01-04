// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Home.css';
import Spotify from '../utils/Spotify';
import player from '../utils/player';

type Props = {
  home: object,
  setCredentials: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { home, setCredentials } = this.props;
    const isAuthorized =
      !!home.credentials.spotify && !!home.credentials.spotify.refresh_token;
    if (!isAuthorized) {
      return (
        <div>
          {
            "So that the virtual radio speaker knows what you're listening to, you first need to connect the app to your Spotify account."
          }
          <button
            onClick={() =>
              Spotify.getCredentials().then(credentials =>
                setCredentials(credentials, 'spotify')
              )
            }
            type="button"
          >
            Connect now
          </button>
        </div>
      );
    }
    return (
      <div
        data-tid="container"
        className={styles.container}
        style={{ backgroundImage: `url(${home.currentTrack.coverArt})` }}
      >
        <button onClick={() => player.play(home)} type="button">
          Play
        </button>

        <button onClick={() => player.pause(home)} type="button">
          Pause
        </button>

        <button onClick={() => player.previous(home)} type="button">
          Previous
        </button>

        <button onClick={() => player.next(home)} type="button">
          Next
        </button>

        <button onClick={() => player.triggerNotification(home)} type="button">
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
