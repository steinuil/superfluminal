import { combineReducers } from 'redux';
import socket from './socket';
import selection from './Selection';
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import server from './server';
import torrents from './torrents';
import files from './files';
import peers from './peers';
import trackers from './trackers';

const root = () =>
  combineReducers({
    socket,
    selection,
    subscribe,
    filter_subscribe,
    server,
    torrents,
    files,
    peers,
    trackers,
  });

export default root;
