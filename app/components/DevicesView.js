import React from 'react';

type Props = {
  obtainDevices: () => void
};

const DevicesView = (props: Props) => {
  const { obtainDevices } = props;
  obtainDevices();
  return <div>Devices</div>;
};

export default DevicesView;
