/* eslint react/destructuring-assignment: "off" */
/* eslint jsx-a11y/interactive-supports-focus: "off" */
/* eslint jsx-a11y/click-events-have-key-events: "off" */
/* eslint react/no-danger: "off" */
/* eslint import/no-webpack-loader-syntax: "off" */

import FontAwesome from 'react-fontawesome';
import React from 'react';
import speakyWhite from 'raw-loader!./speaky-white';
import styles from './Player.css';
import VIEWS from './ViewsConstant';

type Props = {
  player: object,
  swapAlwaysOnTop: () => void,
  setActiveView: () => void,
  updatePreference: () => void
};

const ConfigurationView = (props: Props) => {
  const resetTimerConfigView = () => props.setActiveView(VIEWS.CONFIGURATION);
  return (
    <div className={styles.configuration}>
      <button
        onClick={() => {
          resetTimerConfigView();
          props.updatePreference('TTS', !props.player.preferences.TTS);
        }}
        className={`${styles.configButton} ${props.player.preferences.TTS &&
          styles.active}`}
        type="button"
      >
        <div className={styles.speakyIcon}>
          <div dangerouslySetInnerHTML={{ __html: speakyWhite }} />
        </div>
      </button>

      <button
        type="button"
        className={`${styles.configButton} ${props.player.preferences
          .alwaysOnTop && styles.active}`}
        onClick={() => {
          resetTimerConfigView();
          props.swapAlwaysOnTop();
        }}
      >
        <FontAwesome name="thumbtack" />
      </button>

      <button
        type="button"
        className={`${styles.configButton} ${props.player.preferences
          .notifications && styles.active}`}
        onClick={() => {
          resetTimerConfigView();
          props.updatePreference(
            'notifications',
            !props.player.preferences.notifications
          );
        }}
      >
        <FontAwesome name="bell" />
      </button>
    </div>
  );
};

export default ConfigurationView;
