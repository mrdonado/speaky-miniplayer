import store from '../store';
import config from '../config';
import { getCurrentTrack, swapAlwaysOnTop } from '../actions/player';

let cronjobId;

const isAppAuthorized = state => {
  const { currentService, credentials } = state.player;
  return (
    credentials &&
    credentials[currentService] &&
    credentials[currentService].refresh_token
  );
};

const cronjobTasks = async () => {
  const state = store.getState();
  if (!isAppAuthorized(state)) {
    console.log('No update will be performed until the app is authorized.');
    return;
  }
  // 1st task: dispatch getCurrentTrack
  store.dispatch(getCurrentTrack());
};

const start = () => {
  const state = store.getState();

  if (!state.player.preferences.alwaysOnTop) {
    store.dispatch(swapAlwaysOnTop(false));
  }
  cronjobTasks();

  cronjobId = setInterval(cronjobTasks, config.updateInterval);
};

const stop = () => {
  if (cronjobId) {
    clearInterval(cronjobId);
  }
};

export default {
  start,
  stop
};
