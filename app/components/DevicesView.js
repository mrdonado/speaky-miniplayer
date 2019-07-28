/* eslint jsx-a11y/click-events-have-key-events: "off" */

import React from 'react';
import styles from './DevicesView.css';

type Props = {
  devices: [],
  transferPlayback: () => void,
  obtainDevices: () => void
};

const DevicesList = (
  devices: Array,
  transferPlayback: () => void,
  obtainDevices: () => void
) =>
  devices.map(d => (
    <li key={d.id}>
      <button
        type="button"
        onClick={() =>
          transferPlayback(d.id)
            // Wait for 150ms in order to make sure that the devices
            // list has been updated on Spotify
            .then(() => setTimeout(obtainDevices, 150))
        }
        className={d.is_active ? styles.active : ''}
      >
        {d.name}
      </button>
    </li>
  ));

const DevicesView = (props: Props) => {
  const { devices, transferPlayback, obtainDevices } = props;
  return Array.isArray(devices) ? (
    <ul className={styles.devicesList}>
      {DevicesList(devices, transferPlayback, obtainDevices)}
    </ul>
  ) : (
    <div>No devices are currently available</div>
  );
};

export default DevicesView;
