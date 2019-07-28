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
            // Wait for 400ms in order to make sure that the devices
            // list has been updated on Spotify
            .then(() => setTimeout(obtainDevices, 400))
        }
        className={d.is_active ? styles.active : ''}
      >
        {d.name}
      </button>
    </li>
  ));

const DevicesView = (props: Props) => {
  const { devices, transferPlayback, obtainDevices } = props;
  const devicesList = Array.isArray(devices) ? (
    <ul className={styles.devicesList}>
      {DevicesList(devices, transferPlayback, obtainDevices)}
    </ul>
  ) : (
    <div>No devices are currently available</div>
  );
  return <div className={styles.devicesView}>{devicesList}</div>;
};

export default DevicesView;
