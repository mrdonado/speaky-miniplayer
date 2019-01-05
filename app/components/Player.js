// @flow
import FontAwesome from 'react-fontawesome';
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
        {player.currentTrack.playing ? (
          <button onClick={pause} type="button">
            <FontAwesome name="pause" />
          </button>
        ) : (
          <button onClick={play} type="button">
            <FontAwesome name="play" />
          </button>
        )}

        <button onClick={previous} type="button">
          <FontAwesome name="backward" />
        </button>

        <button onClick={next} type="button">
          <FontAwesome name="forward" />
        </button>

        <button onClick={triggerNotification} type="button">
          <FontAwesome name="bell" />
        </button>

        <button type="button" onClick={swapAlwaysOnTop}>
          <FontAwesome name="thumbtack" />
        </button>
      </div>
    );
  }
}
