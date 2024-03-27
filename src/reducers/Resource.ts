import { SynapseResource, PartialResource } from '../types/SynapseProtocol';
import { Reducer } from 'redux';
import { ResourceMap, AppAction } from '../redux/Store';
import produce from 'immer';
import { SOCKET_STATE } from '../actions/socket';

export const resourceReducer = <
  T extends Exclude<SynapseResource['type'], 'server'>
>(
  type: T
): Reducer<ResourceMap<Extract<SynapseResource, { type: T }>>, AppAction> => (
  state = {},
  action
) => {
  switch (action.type) {
    case 'UPDATE_RESOURCES':
      return produce(state, (draft) => {
        action.resources
          .filter(
            (r): r is PartialResource<Extract<SynapseResource, { type: T }>> =>
              r.type === type
          )
          .forEach(({ id, ...rest }) => {
            draft[id] = { ...(state[id] || { id }), ...rest } as any;
          });
      });
    case 'RESOURCES_REMOVED':
      return produce(state, (draft) => {
        action.ids.forEach((id) => {
          delete draft[id];
        });
      });
    case 'SOCKET_UPDATE':
      return action.state === SOCKET_STATE.CONNECTING ? {} : state;
    default:
      return state;
  }
};
