import store from '../store';
import config from '../config';
import { getCurrentTrack } from '../actions/player';

let cronjobId;

const isAppAuthorized = state => {
  const { currentService } = state.player;
  return (
    state.player.credentials &&
    state.player.credentials[currentService] &&
    state.player.credentials[currentService].refresh_token
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
