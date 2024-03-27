import { Reducer } from 'redux';
import { SynapseId } from '../types/SynapseProtocol';
import { AppAction } from '../redux/Store';
import Immutable from 'immutable';

export const selection: Reducer<Immutable.Set<SynapseId>, AppAction> = (
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
