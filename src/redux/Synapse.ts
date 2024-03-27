import { SynapseClientMessage } from '../types/SynapseProtocol';
import { ConnectionCredentials } from './Credentials';
import { AppAction, AppThunkAction } from './Store';
import {
  websocketConnect,
  websocketDisconnect,
} from './SynapseSocketMiddleware';
import { SynapseSerial } from '../types/SynapseProtocol';
import { Action, Reducer } from 'redux';

export type SynapseAction = Action<'synapse/incrementSerial'>;

export type SynapseState = { serial: number };

export const synapseConnect = ({ uri, password }: ConnectionCredentials) =>
  websocketConnect(
    `${uri}${password && `?password=${encodeURIComponent(password)}`}`
  );

export const synapseDisconnect = () => websocketDisconnect();

type SynapseClientMessageByType = {
  [K in SynapseClientMessage['type']]: Omit<
    Extract<SynapseClientMessage, { type: K }>,
    'serial' | 'type'
  >;
};

export const synapseSend = <T extends SynapseClientMessage['type']>(
  type: T,
  message: SynapseClientMessageByType[T]
): AppThunkAction<SynapseSerial> => (dispatch) => {
  const serial = performance.now() as SynapseSerial;

  dispatch({ type, serial, ...message } as SynapseClientMessage);

  return serial;
};

export const synapseInitSubscriptions = (): AppThunkAction => (dispatch) => {
  dispatch(
    synapseSend('FILTER_SUBSCRIBE', {
      kind: 'server',
      criteria: [],
    })
  );

  dispatch(
    synapseSend('FILTER_SUBSCRIBE', {
      kind: 'torrent',
      criteria: [],
    })
  );
};

export const synapseInitialState: SynapseState = { serial: 0 };

export const synapseReducer: Reducer<SynapseState, AppAction> = (
  state = synapseInitialState,
  action
) => {
  switch (action.type) {
    case 'synapse/incrementSerial':
      return { serial: state.serial + 1 };
    default:
      return state;
  }
};
