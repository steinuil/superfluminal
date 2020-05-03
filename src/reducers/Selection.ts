import { Reducer } from 'redux';
import { SynapseId } from '../types/SynapseProtocol';
import { StoreAction } from '../types/Store';
import Immutable from 'immutable';

export const selection: Reducer<Immutable.Set<SynapseId>, StoreAction> = (
  state = Immutable.Set(),
  action
) => {
  switch (action.type) {
    case 'SELECT_EXCLUSIVE':
      return Immutable.Set(action.ids);
    case 'RESOURCES_REMOVED':
      return state.subtract(action.ids);
    default:
      return state;
  }
};
