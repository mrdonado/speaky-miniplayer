// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Player.css';
import Spotify from '../utils/Spotify';
import playerUtils from '../utils/playerUtils';

type Props = {
  player: object,
  next: () => void,
  setCredentials: () => void
};

export default class Player extends Component<Props> {
  props: Props;

  render() {
    const { player, setCredentials, next } = this.props;
    const isAuthorized =
      !!player.credentials.spotify &&
      !!player.credentials.spotify.refresh_token;
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
        style={{ backgroundImage: `url(${player.currentTrack.coverArt})` }}
      >
        <button onClick={() => playerUtils.play(player)} type="button">
          Play
        </button>

        <button onClick={() => playerUtils.pause(player)} type="button">
          Pause
        </button>

        <button onClick={() => playerUtils.previous(player)} type="button">
          Previous
        </button>

        <button onClick={next} type="button">
          Next
        </button>

        <button
          onClick={() => playerUtils.triggerNotification(player)}
          type="button"
        >
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
