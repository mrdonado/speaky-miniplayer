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
  triggerNotification: () => void,
  setCredentials: () => void
};

let timerId;
const CONFIG_TIMEOUT = 5000;

export default class Player extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.configSwapper = this.configSwapper.bind(this);
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
  configSwapper(value) {
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
      timerId = setTimeout(() => this.configSwapper(false), CONFIG_TIMEOUT);
    }
  }

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
        <div className={styles.overlay}>
          {this.state.showConfig && (
            <div className="configuration">
              <button onClick={triggerNotification} type="button">
                <FontAwesome name="bell" />
              </button>

              <button
                type="button"
                onClick={() => {
                  this.configSwapper(true);
                  swapAlwaysOnTop();
                }}
              >
                <FontAwesome name="thumbtack" />
              </button>
            </div>
          )}
          {!this.state.showConfig && (
            <div className="player">
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

              <div>{player.currentTrack.title}</div>
              <div>{player.currentTrack.album}</div>
              <div>{player.currentTrack.artist}</div>
            </div>
          )}
          <button onClick={this.configSwapper} type="button">
            <FontAwesome name="cog" />
          </button>
        </div>
      </div>
    );
  }
}
