import React from 'react';
import { SynapseId, PeerResource } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';
import { createSelector } from 'reselect';
import { TorrentDetailsPeers } from './TorrentDetailsPeers';

interface Props {
  id: SynapseId;
}

const peersSelector = createSelector(
  (state: State) => state.peers,
  (_: State, id: SynapseId) => id,
  (files, id) => Object.values(files).filter((f) => f.torrent_id === id)
);

export const TorrentDetailsPeersController: React.FC<Props> = ({ id }) => {
  const peers = useSelector<State, PeerResource[]>((s) => peersSelector(s, id));

  return <TorrentDetailsPeers peers={peers} />;
};
