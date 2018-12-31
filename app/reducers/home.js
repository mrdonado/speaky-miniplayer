// @flow
import { REFRESH_CODE } from '../actions/home';
import type { Action } from './types';

const initialState = {
  auth: {
    code: ''
  }
};

export default function home(state = initialState, action: Action) {
  switch (action.type) {
    case REFRESH_CODE:
      return Object.assign({}, state, { auth: { code: action.code } });
    default:
      return state;
  }
}
