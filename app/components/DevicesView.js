/* eslint jsx-a11y/click-events-have-key-events: "off" */
/* eslint jsx-a11y/no-noninteractive-element-to-interactive-role: "off" */

import React from 'react';
import styles from './DevicesView.css';

type Props = {
  devices: [],
  transferPlayback: () => void
};

const DevicesList = (devices: Array, transferPlayback: () => void) =>
  devices.map(d => (
    <li
      key={d.id}
      role="button"
      onClick={() => transferPlayback(d.id)}
      className={d.is_active ? styles.active : ''}
    >
      {d.name}
    </li>
  ));

const DevicesView = (props: Props) => {
  const { devices, transferPlayback } = props;
  return Array.isArray(devices) ? (
    <ul>{DevicesList(devices, transferPlayback)}</ul>
  ) : (
    <div>No devices are currently available</div>
  );
};

export default DevicesView;
