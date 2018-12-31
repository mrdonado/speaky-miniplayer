// @flow
// import type { GetState, Dispatch } from '../reducers/types';

export const REFRESH_CODE = 'REFRESH_CODE';

export function refreshCode(code) {
  return {
    code,
    type: REFRESH_CODE
  };
}
