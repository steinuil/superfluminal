import {
  createStore,
  applyMiddleware,
  compose,
  Action,
  Store,
  combineReducers,
} from 'redux';
import {
  routerMiddleware,
  RouterState,
  connectRouter,
} from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import thunk from 'redux-thunk';
import {
  SynapseResource,
  ServerResource,
  TorrentResource,
  FileResource,
  PeerResource,
  TrackerResource,
  SynapseSerial,
  SynapseId,
  Criterion,
} from './types/SynapseProtocol';

interface ResourceMap<R extends SynapseResource> {
  [id: string]: R;
}

export interface State {
  router: RouterState;
  socket: {
    uri: string;
    password: string;
    state: 'SOCKET_CONNECTED' | 'SOCKET_CONNECTING' | 'SOCKET_DISCONNECTED';
    reason: string | null;
  };
  selection: SynapseId[];
  subscribe: Array<{
    serial: SynapseSerial;
    id: SynapseId;
  }>;
  filter_subscribe: Array<{
    serial: SynapseSerial;
    kind: SynapseResource['type'];
    criteria: Criterion[];
  }>;
  resources: {
    server: ServerResource;
    torrents: ResourceMap<TorrentResource>;
    files: ResourceMap<FileResource>;
    peers: ResourceMap<PeerResource>;
    trackers: ResourceMap<TrackerResource>;
  };
}

const history = createBrowserHistory();

const x = (() => ({})) as any;

const reducer = (history: History) =>
  combineReducers<State>({
    router: connectRouter(history),
    socket: x,
    selection: x,
    subscribe: x,
    filter_subscribe: x,
    resources: x,
  });

export const store = createStore(
  reducer(history),
  applyMiddleware(thunk, routerMiddleware(history))
);
