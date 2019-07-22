import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type playerStateType = {
  +credentials: object,
  +currentService: string,
  +currentTrack: object,
  +lastMessage: string,
  +preferences: object
};

export type Action = {
  +type: string
};

export type GetState = () => playerStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
