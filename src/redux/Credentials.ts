import { Reducer } from 'redux';
import { V } from '../types/Variant';
import { AppAction } from './Store';

export interface ConnectionCredentials {
  uri: string;
  password: string;
}

export type CredentialsAction =
  | V<'credentials/update', { credentials: ConnectionCredentials }>
  | V<'credentials/clear'>;

export type CredentialsState = ConnectionCredentials | null;

export const credentialsInitialState = (): CredentialsState => {
  const uri = localStorage.getItem('autoconnect');
  const password = localStorage.getItem('password');

  if (uri !== null && password !== null) return { uri, password };
  return null;
};

export const credentialsReducer: Reducer<CredentialsState, AppAction> = (
  state = null,
  action
) => {
  switch (action.type) {
    case 'credentials/clear':
      return null;
    case 'credentials/update':
      return action.credentials;
    default:
      return state;
  }
};

export const updateCredentials = (
  credentials: ConnectionCredentials
): AppAction => {
  localStorage.setItem('autoconnect', credentials.uri);
  localStorage.setItem('password', credentials.password);
  return { type: 'credentials/update', credentials };
};

export const clearCredentials = (): AppAction => {
  localStorage.removeItem('autoconnect');
  localStorage.removeItem('password');
  return { type: 'credentials/clear' };
};
