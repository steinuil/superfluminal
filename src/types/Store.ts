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
} from './SynapseProtocol';
import { RouterState } from 'connected-react-router';
import { Action } from 'redux';
import Immutable from 'immutable';

// "struct of arrays"
export type SOA<T extends object> = { [K in keyof T]: T[K][] } & {
  length: number;
};

interface NotConnectedState {
  status: 'NOT_CONNECTED';
  reason: string | null;
}

interface ConnectedState {
  status: 'CONNECTED';
  connection: any;
  serverSubscription: {
    id: SynapseId;
    serial: SynapseSerial;
  } | null;
  torrentsSubscription: {
    serial: SynapseSerial;
    criteria: Criterion[];
  } | null;
  torrents: SOA<TorrentResource>;
}

// export type StoreState = ConnectedState | NotConnectedState;

// export interface StoreState {
//   router: RouterState;
//   socket: {
//     uri: string | null;
//     password: string | null;
//     state: 'SOCKET_CONNECTED' | 'SOCKET_CONNECTING' | 'SOCKET_DISCONNECTED';
//     reason: string | null;
//   };
//   selection: Immutable.Set<SynapseId>;
//   subscribe: Array<{
//     serial: SynapseSerial;
//     id: SynapseId;
//   }>;
//   filter_subscribe: Array<{
//     serial: SynapseSerial;
//     kind: SynapseResource['type'];
//     criteria: Criterion[];
//   }>;
//   server: ServerResource;
//   torrents: ResourceMap<TorrentResource>;
//   files: ResourceMap<FileResource>;
//   peers: ResourceMap<PeerResource>;
//   trackers: ResourceMap<TrackerResource>;
// }

export interface ResourceMap<R extends SynapseResource> {
  [id: string]: R;
}

export interface State {
  router: RouterState;
  socket: {
    uri: string | null;
    password: string | null;
    state: 'SOCKET_CONNECTED' | 'SOCKET_CONNECTING' | 'SOCKET_DISCONNECTED';
    reason: string | null;
  };
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
  // resources: {
  server: ServerResource;
  torrents: SOA<TorrentResource>;
  files: ResourceMap<FileResource>;
  peers: ResourceMap<PeerResource>;
  trackers: ResourceMap<TrackerResource>;
  // };
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

export type StoreAction =
  | SelectionAction
  | ResourcesRemovedAction
  | UpdateAction
  | SocketUpdateAction;
