import produce from 'immer';
import { Reducer } from 'redux';
import { TorrentResource, PartialResource } from '../types/SynapseProtocol';
import { SOA, StoreAction } from '../types/Store';
import { exactEntries, exactKeys } from '../Exact';
import { SOCKET_STATE } from '../actions/socket';

const EMPTY_STATE: Readonly<SOA<TorrentResource>> = {
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
};

const TORRENT_KEYS = exactKeys(EMPTY_STATE);

export const torrentReducer: Reducer<SOA<TorrentResource>, StoreAction> = (
  state = EMPTY_STATE,
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
              draft.id.push(id);
              exactEntries(rest).forEach(([key, value]) => {
                draft[key].push(value);
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

          TORRENT_KEYS.forEach((key) => {
            draft[key].splice(i, 1);
          });
        });
      });
    case 'SOCKET_UPDATE':
      return action.state === SOCKET_STATE.CONNECTING ? EMPTY_STATE : state;
    default:
      return state;
  }
};
