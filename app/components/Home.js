// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import routes from '../constants/routes';
import styles from './Home.css';
import config from '../config';

const saySomething = (text, lang = 'en-US') => {
  const message = new SpeechSynthesisUtterance();
  const voice = window.speechSynthesis
    .getVoices()
    .filter(it => it.lang === lang)[0];
  message.text = text;
  message.voice = voice;
  speechSynthesis.speak(message);
};

const getToken = () => {
  const authWindow = new remote.BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
    'web-security': false
  });

  const authUrl = `https://accounts.spotify.com/en/authorize?client_id=${
    config.spotify.clientId
  }&response_type=code&redirect_uri=${encodeURIComponent(
    config.spotify.redirectUri
  )}&scope=${encodeURI(config.spotify.scopes)}`;

  authWindow.loadURL(authUrl);

  authWindow.show();

  authWindow.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [`${config.spotify.redirectUri}*`]
    },
    (details, callback) => {
      const token = details.url.replace(
        `${config.spotify.redirectUri}?code=`,
        ''
      );
      console.log(token);
      callback({ cancel: false });
      authWindow.close();
    }
  );
};

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>

        <button
          onClick={() =>
            saySomething(
              'You just heard whatever by whoever, from the album whatever'
            )
          }
          type="button"
        >
          Inform me now!
        </button>

        <button onClick={() => getToken()} type="button">
          Get the token!!
        </button>
      </div>
    );
  }
}
