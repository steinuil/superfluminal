import React from 'react';
import { SynapseId, TrackerResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';
import { createSelector } from 'reselect';
import { TorrentDetailsTrackers } from './TorrentDetailsTrackers';

interface Props {
  id: SynapseId;
}

const trackersSelector = createSelector(
  (state: State) => state.trackers,
  (_: State, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsTrackersController: React.FC<Props> = ({ id }) => {
  const trackers = useSelector<State, TrackerResource[]>((s) =>
    trackersSelector(s, id)
  );

  return <TorrentDetailsTrackers trackers={trackers} />;
};
