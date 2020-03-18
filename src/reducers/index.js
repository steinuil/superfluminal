import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import socket from './socket';
import selection from './selection';
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import server from './server';
import torrents from './torrents';
import files from './files';
import peers from './peers';
import trackers from './trackers';

const root = (history) => combineReducers({
  socket,
  selection,
  subscribe,
  filter_subscribe,
  server,
  torrents,
  files,
  peers,
  trackers,
  router: connectRouter(history)
});

export default root;
