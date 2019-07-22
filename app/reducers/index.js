// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import player from './player';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    player
  });
}
