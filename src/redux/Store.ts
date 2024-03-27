import {
  SynapseResource,
  SynapseId,
  SynapseSerial,
  Criterion,
  ServerResource,
  TorrentResource,
  FileResource,
  PeerResource,
  TrackerResource,
  PartialSynapseResource,
} from '../types/SynapseProtocol';
import { Action } from 'redux';
import Immutable from 'immutable';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  SynapseMessageAction,
  WebsocketAction,
} from './SynapseSocketMiddleware';
import { CredentialsAction, CredentialsState } from './Credentials';
import { ConnectionStatus } from './ConnectionStatus';
import { SynapseAction, SynapseState } from './Synapse';
import { UiAction, UiState } from './Ui';

// "struct of arrays"
export type SOA<T extends object> = { [K in keyof T]: T[K][] };

export interface ResourceMap<R extends SynapseResource> {
  [id: string]: R;
}

export interface AppState {
  connectionStatus: ConnectionStatus;
  credentials: CredentialsState;
  selection: Immutable.Set<SynapseId>;
  subscribe: Array<{
    serial: SynapseSerial;
    id: SynapseId;
  }>;
  filter_subscribe: Array<{
    serial: SynapseSerial;
    kind: SynapseResource['type'];
    criteria: Criterion[];
  }>;
  server: ServerResource;
  torrents: SOA<TorrentResource>;
  files: ResourceMap<FileResource>;
  peers: ResourceMap<PeerResource>;
  trackers: ResourceMap<TrackerResource>;
  synapse: SynapseState;
  ui: UiState;
}

export interface SelectionAction extends Action<'SELECT_EXCLUSIVE'> {
  ids: SynapseId[];
}

export interface ResourcesRemovedAction extends Action<'RESOURCES_REMOVED'> {
  ids: SynapseId[];
}

export interface UpdateAction extends Action<'UPDATE_RESOURCES'> {
  resources: PartialSynapseResource[];
}

export interface SocketUpdateAction extends Action<'SOCKET_UPDATE'> {
  state: any;
}

export type AppAction =
  | SelectionAction
  | ResourcesRemovedAction
  | UpdateAction
  | SocketUpdateAction
  | CredentialsAction
  | WebsocketAction
  | SynapseMessageAction
  | SynapseAction
  | UiAction;

export type AppThunkAction<R = void> = ThunkAction<
  R,
  AppState,
  undefined,
  AppAction
>;

export type AppDispatch = ThunkDispatch<AppState, undefined, AppAction>;
