import thunk, { ThunkMiddleware } from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  Reducer,
  PreloadedState,
} from 'redux';

import { selection } from './reducers/Selection';
import subscribe from './reducers/subscribe';
import filter_subscribe from './reducers/filter_subscribe';
import server from './reducers/server';
import { resourceReducer } from './reducers/Resource';
import { AppState, AppAction } from './redux/Store';
import {
  torrentReducer,
  EMPTY_STATE as TORRENT_EMPTY_STATE,
} from './reducers/TorrentReducer';
import createWebsocketMiddleware from './redux/SynapseSocketMiddleware';
import { Set as ImmutableSet } from 'immutable';
import {
  credentialsInitialState,
  credentialsReducer,
} from './redux/Credentials';
import {
  connectionStatusInitialState,
  connectionStatusReducer,
} from './redux/ConnectionStatus';
import { synapseInitialState, synapseReducer } from './redux/Synapse';
import { uiInitialState, uiReducer } from './redux/Ui';

const reducer = combineReducers<AppState, AppAction>({
  connectionStatus: connectionStatusReducer,
  credentials: credentialsReducer,
  selection: selection,
  subscribe: subscribe,
  filter_subscribe: filter_subscribe,
  server: server,
  torrents: torrentReducer,
  files: resourceReducer('file'),
  peers: resourceReducer('peer'),
  trackers: resourceReducer('tracker'),
  synapse: synapseReducer,
  ui: uiReducer,
});

export const makeStore = () => {
  const initialState: PreloadedState<AppState> = {
    connectionStatus: connectionStatusInitialState,
    credentials: credentialsInitialState(),
    selection: ImmutableSet(),
    subscribe: [],
    filter_subscribe: [],
    server: null as any,
    torrents: TORRENT_EMPTY_STATE as any,
    files: {},
    peers: {},
    trackers: {},
    synapse: synapseInitialState,
    ui: uiInitialState as any,
  };

  return createStore(
    reducer,
    initialState,
    applyMiddleware(
      thunk as ThunkMiddleware<AppState, AppAction>,
      createWebsocketMiddleware()
    )
  );
};

export const store = createStore(reducer, applyMiddleware(thunk));
