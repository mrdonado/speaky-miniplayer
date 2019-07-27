import React from 'react';

type Props = {
  devices: []
};

const DevicesList = (devices: Array) =>
  devices.map(d => <div key={d.id}>{d.name}</div>);

const DevicesView = (props: Props) => {
  const { devices } = props;
  console.log(devices);
  return Array.isArray(devices) ? (
    <div>{DevicesList(devices)}</div>
  ) : (
    <div>No devices are currently available</div>
  );
};

export default DevicesView;
