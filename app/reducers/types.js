import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type homeStateType = {
  +counter: number,
  +credentials: object,
  +currentService: string
};

export type Action = {
  +type: string
};

export type GetState = () => homeStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
