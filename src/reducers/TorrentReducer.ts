import produce from 'immer';
import { Reducer } from 'redux';
import { TorrentResource, PartialResource } from '../types/SynapseProtocol';
import { SOA, StoreAction } from '../types/Store';
import { exactEntries, exactKeys } from '../Exact';
import { SOCKET_STATE } from '../actions/socket';

const emptyState: SOA<TorrentResource> = {
  availability: [],
  comment: [],
  created: [],
  creator: [],
  error: [],
  files: [],
  id: [],
  modified: [],
  name: [],
  path: [],
  peers: [],
  piece_field: [],
  piece_size: [],
  pieces: [],
  priority: [],
  private: [],
  progress: [],
  rate_down: [],
  rate_up: [],
  size: [],
  status: [],
  strategy: [],
  throttle_down: [],
  throttle_up: [],
  tracker_urls: [],
  trackers: [],
  transferred_down: [],
  transferred_up: [],
  type: [],
  user_data: [],
  length: 0,
};

const torrentKeys = exactKeys(emptyState);

const findFreeSlot = (array: any[]) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === undefined) {
      return i;
    }
  }

  return array.length;
};

export const torrentReducer: Reducer<SOA<TorrentResource>, StoreAction> = (
  state = emptyState,
  action
) => {
  switch (action.type) {
    case 'UPDATE_RESOURCES':
      return produce(state, (draft) => {
        action.resources
          .filter(
            (r): r is PartialResource<TorrentResource> => r.type === 'torrent'
          )
          .forEach(({ id, ...rest }) => {
            const i = draft.id.indexOf(id);

            if (i === -1) {
              const free = findFreeSlot(draft.id);

              draft.length += 1;

              draft.id[free] = id;
              exactEntries(rest).forEach(([key, value]) => {
                draft[key][free] = value as any;
              });
            } else {
              exactEntries(rest).forEach(([key, value]) => {
                draft[key][i] = value as any;
              });
            }
          });
      });
    case 'RESOURCES_REMOVED':
      return produce(state, (draft) => {
        action.ids.forEach((id) => {
          const i = state.id.indexOf(id);
          if (i === -1) return;

          draft.length -= 1;

          torrentKeys.forEach((key) => {
            if (key === 'length') return;
            delete draft[key][i];
          });
        });
      });
    case 'SOCKET_UPDATE':
      return action.state === SOCKET_STATE.CONNECTING ? emptyState : state;
    default:
      return state;
  }
};
