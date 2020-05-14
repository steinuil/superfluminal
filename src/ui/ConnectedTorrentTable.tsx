import React from 'react';
import { TorrentList } from './TorrentList';
import { SynapseId } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';
import { createSelector } from 'reselect';

interface Props {
  className?: string;
  onSelectTorrent: (id: SynapseId) => void;
}

const sortedTorrentsSelector = createSelector(
  (store: State) => store.torrents.id,
  (store: State) => store.torrents.name,
  (ids, names) => {
    const namesById: { [id: string]: string | null } = {};

    for (let i = 0; i < ids.length; i += 1) {
      namesById[ids[i]] = names[i];
    }

    return ids.slice().sort((aId, bId) => {
      const aName = namesById[aId];
      const bName = namesById[bId];
      if (aName === null && bName === null) return 0;
      // Sort null lower
      if (aName === null) return 1;
      if (bName === null) return -1;
      return aName.localeCompare(bName);
    });
  }
);

export const ConnectedTorrentTable: React.FC<Props> = ({
  className,
  onSelectTorrent,
}) => {
  const torrents = useSelector(sortedTorrentsSelector);

  return (
    <TorrentList
      torrents={torrents}
      className={className}
      onSelectTorrent={onSelectTorrent}
    />
  );
};
