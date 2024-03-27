import { Reducer } from 'redux';
import { AppAction } from './Store';

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'NOT_CONNECTED';

export const connectionStatusInitialState = 'NOT_CONNECTED';

export const connectionStatusReducer: Reducer<ConnectionStatus, AppAction> = (
  state = 'NOT_CONNECTED',
  action
) => {
  switch (action.type) {
    case 'websocket/connect':
      return 'CONNECTING';
    case 'websocket/opened':
      return 'CONNECTED';
    case 'websocket/closed':
      return 'NOT_CONNECTED';
    default:
      return state;
  }
};
