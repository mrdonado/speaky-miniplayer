/* eslint react/destructuring-assignment: "off" */
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
  updatePreference: () => void,
  setCredentials: () => void
};

let timerId;
const CONFIG_TIMEOUT = 5000;

export default class Player extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.swapConfigView = this.swapConfigView.bind(this);
    this.state = {
      showConfig: false
    };
  }

  /**
   * It shows or hides the configuration, when `value` is a boolean.
   * When `value` is different from a boolean, it will swap the
   * `showConfig` value.
   *
   * When the config has been set to be shown (`value = true`), a
   * timer is configured to automatically go back to the main view.
   */
  swapConfigView(value) {
    if (timerId) {
      clearTimeout(timerId);
    }
    const wasActive = this.state.showConfig;
    if (typeof value === 'boolean') {
      this.setState({ showConfig: value });
    } else {
      this.setState({ showConfig: !wasActive });
    }
    if (!wasActive || value === true) {
      timerId = setTimeout(() => this.swapConfigView(false), CONFIG_TIMEOUT);
    }
  }

  render() {
    const {
      player,
      setCredentials,
      swapAlwaysOnTop,
      updatePreference,
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
        <div className={styles.container}>
          <div className={styles.loginView}>
            <div className={styles.loginText}>
              {
                'Speaky MiniPlayer needs a connection to a streaming music service.'
              }
            </div>
            <button
              onClick={() =>
                Spotify.getCredentials().then(credentials =>
                  setCredentials(credentials, 'spotify')
                )
              }
              type="button"
            >
              Connect to Spotify
            </button>
          </div>
        </div>
      );
    }
    return (
      <div
        data-tid="container"
        className={styles.container}
        style={{ backgroundImage: `url(${player.currentTrack.coverArt})` }}
      >
        <div className={styles.overlay}>
          {this.state.showConfig && (
            <div className={styles.configuration}>
              <button
                onClick={() => {
                  this.swapConfigView(true);
                  updatePreference('TTS', !player.preferences.TTS);
                }}
                className={`${styles.configButton} ${player.preferences.TTS &&
                  styles.active}`}
                type="button"
              >
                <FontAwesome name="microphone" />
              </button>

              <button
                type="button"
                className={`${styles.configButton} ${player.preferences
                  .alwaysOnTop && styles.active}`}
                onClick={() => {
                  this.swapConfigView(true);
                  swapAlwaysOnTop();
                }}
              >
                <FontAwesome name="thumbtack" />
              </button>

              <button
                type="button"
                className={`${styles.configButton} ${player.preferences
                  .notifications && styles.active}`}
                onClick={() => {
                  updatePreference(
                    'notifications',
                    !player.preferences.notifications
                  );
                }}
              >
                <FontAwesome name="bell" />
              </button>
            </div>
          )}
          {!this.state.showConfig && (
            <div className={styles.player}>
              <button onClick={previous} type="button">
                <FontAwesome name="backward" />
              </button>

              {player.currentTrack.playing ? (
                <button onClick={pause} type="button">
                  <FontAwesome name="pause" />
                </button>
              ) : (
                <button onClick={play} type="button">
                  <FontAwesome name="play" />
                </button>
              )}

              <button onClick={next} type="button">
                <FontAwesome name="forward" />
              </button>
              <div className={styles.trackInfo}>
                <div>{player.currentTrack.title}</div>
                <div>{player.currentTrack.album}</div>
                <div>{player.currentTrack.artist}</div>
              </div>
            </div>
          )}
          <button
            className={`${styles.swapConfigButton} 
            ${this.state.showConfig && styles.active}`}
            onClick={this.swapConfigView}
            type="button"
          >
            <FontAwesome name="cog" />
          </button>
        </div>
      </div>
    );
  }
}
