// @flow
import React, { Component } from 'react';
import styles from './Player.css';
import Spotify from '../utils/Spotify';

type Props = {
  player: object,
  next: () => void,
  previous: () => void,
  play: () => void,
  pause: () => void,
  swapAlwaysOnTop: () => void,
  triggerNotification: () => void,
  setCredentials: () => void
};

export default class Player extends Component<Props> {
  props: Props;

  render() {
    const {
      player,
      setCredentials,
      triggerNotification,
      swapAlwaysOnTop,
      next,
      previous,
      play,
      pause
    } = this.props;

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
        <button onClick={play} type="button">
          Play
        </button>

        <button onClick={pause} type="button">
          Pause
        </button>

        <button onClick={previous} type="button">
          Previous
        </button>

        <button onClick={next} type="button">
          Next
        </button>

        <button onClick={triggerNotification} type="button">
          Inform me now!
        </button>

        <button type="button" onClick={swapAlwaysOnTop}>
          Swap always on top
        </button>
      </div>
    );
  }
}
