// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

const saySomething = (text, lang = 'en-US') => {
  const message = new SpeechSynthesisUtterance();
  const voice = window.speechSynthesis
    .getVoices()
    .filter(it => it.lang === lang)[0];
  message.text = text;
  message.voice = voice;
  speechSynthesis.speak(message);
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
          onClick={() => saySomething('This is a wonderful test!!')}
          type="button"
        >
          {' '}
          Now say something nice!
        </button>
      </div>
    );
  }
}
