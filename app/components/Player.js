/* eslint react/destructuring-assignment: "off" */
/* eslint jsx-a11y/interactive-supports-focus: "off" */
/* eslint jsx-a11y/click-events-have-key-events: "off" */
/* eslint react/no-danger: "off" */
/* eslint import/no-webpack-loader-syntax: "off" */

// @flow
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { shell, remote } from 'electron';
import styles from './Player.css';
import Spotify from '../utils/Spotify';
import VIEWS from './ViewsConstant';
import ConfigurationView from './ConfigurationView';
import DevicesView from './DevicesView';

type Props = {
  player: object,
  next: () => void,
  previous: () => void,
  logout: () => void,
  play: () => void,
  pause: () => void,
  obtainDevices: () => void,
  transferPlayback: () => void,
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

const showCdCover = coverArt => {
  const cdCoverWindow = new remote.BrowserWindow({
    width: 640,
    height: 640,
    titleBarStyle: 'hiddenInset',
    show: false,
    maximizable: false,
    fullscreenable: false,
    'node-integration': false,
    'web-security': false
  });
  cdCoverWindow.loadURL(coverArt);
  cdCoverWindow.show();
  setTimeout(() => cdCoverWindow.close(), 5000);
};

export default class Player extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.setActiveView = this.setActiveView.bind(this);
    this.state = {
      activeView: VIEWS.PLAYER
    };
  }

  /**
   * It sets the specified view. When the view to be shown is
   * CONFIGURATION, a timeout back to PLAYER view will be programmed.
   */
  setActiveView(activeView) {
    this.setState({ activeView });

    if (timerId) {
      clearTimeout(timerId);
    }

    if (activeView === VIEWS.CONFIGURATION) {
      timerId = setTimeout(
        () => this.setActiveView(VIEWS.PLAYER),
        CONFIG_TIMEOUT
      );
    }
  }

  render() {
    const {
      player,
      setCredentials,
      swapAlwaysOnTop,
      updatePreference,
      obtainDevices,
      transferPlayback,
      next,
      previous,
      play,
      pause,
      logout
    } = this.props;

    const isAuthorized =
      !!player.credentials.spotify &&
      !!player.credentials.spotify.refresh_token;

    if (!isAuthorized) {
      return (
        <div className={styles.container}>
          <div className={styles.loginView}>
            <div className={styles.loginText}>
              Speaky MiniPlayer needs a connection to a streaming music service.
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
        className={`${styles.container} ${!player.preferences.alwaysOnTop &&
          styles.noTransparent}`}
        style={{ backgroundImage: `url(${player.currentTrack.coverArt})` }}
      >
        <div className={styles.overlay}>
          {this.state.activeView === VIEWS.CONFIGURATION && (
            <ConfigurationView
              setActiveView={this.setActiveView}
              player={player}
              swapAlwaysOnTop={swapAlwaysOnTop}
              updatePreference={updatePreference}
              logout={logout}
            />
          )}
          {this.state.activeView === VIEWS.DEVICES && (
            <DevicesView
              setActiveView={this.setActiveView}
              devices={player.devices}
              transferPlayback={transferPlayback}
              obtainDevices={obtainDevices}
            />
          )}
          {this.state.activeView === VIEWS.PLAYER && (
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
          <div className={`${styles.swapViewButtons}`}>
            <button
              type="button"
              onClick={() => {
                showCdCover(player.currentTrack.coverArt);
              }}
            >
              <FontAwesome name="compact-disc" />
            </button>

            <button
              className={`${this.state.activeView === VIEWS.DEVICES &&
                styles.active}`}
              type="button"
              onClick={() => {
                obtainDevices();
                this.setActiveView(
                  this.state.activeView === VIEWS.DEVICES
                    ? VIEWS.PLAYER
                    : VIEWS.DEVICES
                );
              }}
            >
              <FontAwesome name="mobile-alt" />
            </button>
            <button
              className={`${styles.swapConfigButton} 
            ${this.state.activeView === VIEWS.CONFIGURATION && styles.active}`}
              onClick={() =>
                this.setActiveView(
                  this.state.activeView === VIEWS.CONFIGURATION
                    ? VIEWS.PLAYER
                    : VIEWS.CONFIGURATION
                )
              }
              type="button"
            >
              <FontAwesome name="cog" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
