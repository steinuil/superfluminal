import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, Reducer } from 'redux';

import socket from './reducers/socket';
import { selection } from './reducers/Selection';
import subscribe from './reducers/subscribe';
import filter_subscribe from './reducers/filter_subscribe';
import server from './reducers/server';
import { resourceReducer } from './reducers/Resource';
import { State } from './types/Store';
import { torrentReducer } from './reducers/TorrentReducer';

const reducer =
  combineReducers<State>({
    socket: socket as Reducer<State['socket']>,
    selection: selection,
    subscribe: subscribe,
    filter_subscribe: filter_subscribe,
    server: server,
    torrents: torrentReducer,
    files: resourceReducer('file'),
    peers: resourceReducer('peer'),
    trackers: resourceReducer('tracker'),
  });

export const store = createStore(
  reducer,
  applyMiddleware(thunk)
);
