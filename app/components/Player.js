/* eslint react/destructuring-assignment: "off" */
/* eslint jsx-a11y/interactive-supports-focus: "off" */
/* eslint jsx-a11y/click-events-have-key-events: "off" */
/* eslint react/no-danger: "off" */
/* eslint import/no-webpack-loader-syntax: "off" */

// @flow
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { shell } from 'electron';
import styles from './Player.css';
import Spotify from '../utils/Spotify';
import ConfigurationView from './ConfigurationView';

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

const showInfo = (info, track) => {
  const cleanItAndURL = input =>
    encodeURI(input.split(/[-()[\]]/g)[0].replace(/\s/g, '+'));

  const title = cleanItAndURL(track.title);
  const artist = cleanItAndURL(track.artist);
  const album = cleanItAndURL(track.album);

  switch (info) {
    case 'title':
      shell.openExternal(
        `https://search.azlyrics.com/search.php?q=${artist}+${title}`
      );
      return;
    case 'album':
      shell.openExternal(
        `https://www.allmusic.com/search/all/${album}+${artist}`
      );
      return;
    case 'artist':
      shell.openExternal(`https://www.allmusic.com/search/all/${artist}`);
      return;
    default:
      console.warn(`Calling showInfo with ${info}`);
  }
};

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
            <ConfigurationView
              swapConfigView={this.swapConfigView}
              player={player}
              swapAlwaysOnTop={swapAlwaysOnTop}
              updatePreference={updatePreference}
            />
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
                <div
                  onClick={() => showInfo('title', player.currentTrack)}
                  role="button"
                >
                  {player.currentTrack.title}
                </div>
                <div
                  onClick={() => showInfo('album', player.currentTrack)}
                  role="button"
                >
                  {player.currentTrack.album}
                </div>
                <div
                  onClick={() => showInfo('artist', player.currentTrack)}
                  role="button"
                >
                  {player.currentTrack.artist}
                </div>
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
