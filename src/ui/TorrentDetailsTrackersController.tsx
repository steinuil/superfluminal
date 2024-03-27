import React from 'react';
import { SynapseId, TrackerResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Store';
import { createSelector } from 'reselect';
import { TorrentDetailsTrackers } from './TorrentDetailsTrackers';

interface Props {
  id: SynapseId;
}

const trackersSelector = createSelector(
  (state: AppState) => state.trackers,
  (_: AppState, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsTrackersController: React.FC<Props> = ({ id }) => {
  const trackers = useSelector<AppState, TrackerResource[]>((s) =>
    trackersSelector(s, id)
  );

  return <TorrentDetailsTrackers trackers={trackers} />;
};
