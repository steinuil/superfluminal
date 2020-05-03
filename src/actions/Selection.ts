import { SynapseId } from '../types/SynapseProtocol';
import { StoreAction, State } from '../types/Store';
import { ThunkAction } from 'redux-thunk';
import { filter_subscribe, filter_unsubscribe } from './filter_subscribe';
import { unsubscribe } from './subscribe';

export const selectTorrents = (
  ids: SynapseId[]
): ThunkAction<void, State, void, StoreAction> => {
  return (dispatch, getState) => {
    const prevSelection = getState().selection;

    dispatch({ type: 'SELECT_EXCLUSIVE', ids });

    const {
      selection,
      files,
      peers,
      trackers,
      filter_subscribe: filters,
    } = getState();

    // Added
    selection.subtract(prevSelection).forEach((t) => {
      const criteria = [{ field: 'torrent_id', op: '==', value: t }];
      dispatch(filter_subscribe('peer', criteria));
      dispatch(filter_subscribe('file', criteria));
      dispatch(filter_subscribe('tracker', criteria));
    });

    // Removed
    prevSelection.subtract(selection).forEach((t) => {
      const serials = filters
        .filter((sub) => sub.criteria[0] && sub.criteria[0].value === t)
        .map((sub) => sub.serial);

      serials.forEach((serial) => dispatch(filter_unsubscribe(serial)));

      const ids = [
        ...Object.values(files)
          .filter((file) => file.torrent_id === t)
          .map((file) => file.id),
        ...Object.values(peers)
          .filter((peer) => peer.torrent_id === t)
          .map((peer) => peer.id),
        ...Object.values(trackers)
          .filter((tracker) => tracker.torrent_id === t)
          .map((tracker) => tracker.id),
      ];

      if (ids.length > 0) {
        dispatch(unsubscribe(...ids));
      }
    });
  };
};
