import React from 'react';
import { TorrentList } from './TorrentList';
import { SynapseId } from '../types/SynapseProtocol';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';
import {
  createSelectorCreator,
  defaultMemoize,
  createSelector,
} from 'reselect';

interface Props {
  className?: string;
  onSelectTorrent: (id: SynapseId) => void;
}

const createArraySelector = createSelectorCreator(
  defaultMemoize,
  (curr, prev) => {
    if (!Array.isArray(curr) || !Array.isArray(prev)) return curr === prev;
    if (curr.length !== prev.length) return false;
    for (let i = 0; i < curr.length; i += 1) {
      if (curr[i] !== prev[i]) return false;
    }
    return true;
  }
);

const torrentIdsSelector = createSelector(
  (store: State) => store.torrents,
  (torrentMap) => {
    const ids: SynapseId[] = [];
    const namesById: { [id: string]: string | null } = {};

    Object.values(torrentMap).forEach(({ id, name }) => {
      ids.push(id);
      namesById[id] = name;
    });

    return ids.sort((aId, bId) => {
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

const memoizedTorrentIdsSelector = createArraySelector(
  torrentIdsSelector,
  (t) => t
);

export const ConnectedTorrentTable: React.FC<Props> = ({
  className,
  onSelectTorrent,
}) => {
  const torrents = useSelector(memoizedTorrentIdsSelector);

  return (
    <TorrentList
      torrents={torrents}
      className={className}
      onSelectTorrent={onSelectTorrent}
    />
  );
};
