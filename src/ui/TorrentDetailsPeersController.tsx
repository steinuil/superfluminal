import React from 'react';
import { SynapseId, PeerResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Store';
import { createSelector } from 'reselect';
import { TorrentDetailsPeers } from './TorrentDetailsPeers';

interface Props {
  id: SynapseId;
}

const peersSelector = createSelector(
  (state: AppState) => state.peers,
  (_: AppState, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsPeersController: React.FC<Props> = ({ id }) => {
  const peers = useSelector<AppState, PeerResource[]>((s) =>
    peersSelector(s, id)
  );

  return <TorrentDetailsPeers peers={peers} />;
};
