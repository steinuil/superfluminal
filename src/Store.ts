import thunk from 'redux-thunk';
import { createBrowserHistory, History } from 'history';
import { createStore, applyMiddleware, combineReducers, Reducer } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';

import socket from './reducers/socket';
import selection from './reducers/selection';
import subscribe from './reducers/subscribe';
import filter_subscribe from './reducers/filter_subscribe';
import server from './reducers/server';
import torrents from './reducers/torrents';
import files from './reducers/files';
import peers from './reducers/peers';
import trackers from './reducers/trackers';
import { State } from './types/Store';

export const history = createBrowserHistory();

const reducer = (history: History) =>
  combineReducers<State>({
    router: connectRouter(history),
    socket: socket as Reducer<State['socket']>,
    selection: selection,
    subscribe: subscribe,
    filter_subscribe: filter_subscribe,
    // resources: combineReducers<State['resources']>({
    server: server,
    torrents: torrents,
    files: files,
    peers: peers,
    trackers: trackers,
    // }),
  });

export const store = createStore(
  reducer(history),
  applyMiddleware(thunk, routerMiddleware(history))
);
