import produce from 'immer';
import { Reducer } from 'redux';
import { TorrentResource, SynapseResource } from '../types/SynapseProtocol';
import { ResourceMap } from '../types/Store';

export const torrentReducer: Reducer<ResourceMap<TorrentResource>> = (
  state = {},
  action
) => {
  switch (action.type) {
    case 'UPDATE_RESOURCES':
      return produce(state, (draft) => {
        (action.resources as SynapseResource[])
          .filter((r): r is TorrentResource => r.type === 'torrent')
          .forEach((x) => {});
      });
    case 'RESOURCES_REMOVED':
    case 'SOCKET_UPDATE':
    default:
      return state;
  }
};
