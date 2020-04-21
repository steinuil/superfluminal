import React, { useState, useCallback, useRef } from 'react';
import { TorrentTable } from './TorrentTable';
import { TorrentResource, SynapseId } from '../types/SynapseProtocol';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types/Store';
import selectTorrent, { EXCLUSIVE } from '../actions/selection';

interface Selected {
  torrentIds: SynapseId[];
  torrents: TorrentResource[];
  selection: SynapseId[];
}

type SortColumn = 'name' | 'up' | 'down' | 'ul' | 'dl' | 'ratio' | 'progress';

type Comparators = {
  [k in SortColumn]: (a: TorrentResource, b: TorrentResource) => number;
};

const COMPARATORS: Comparators = {
  name: (a, b) => {
    if (a.name === null && b.name === null) return 0;
    if (a.name === null) return -1;
    if (b.name === null) return 1;
    return b.name.localeCompare(a.name);
  },
  up: (a, b) => a.rate_up - b.rate_up,
  down: (a, b) => a.rate_down - b.rate_down,
  ul: (a, b) => a.transferred_up - b.transferred_up,
  dl: (a, b) => a.transferred_down - b.transferred_down,
  ratio: (a, b) => {
    const ratioA = a.transferred_up / a.transferred_down;
    const ratioB = b.transferred_up / b.transferred_down;
    if (!isFinite(ratioA) && !isFinite(ratioB)) return 0;
    if (!isFinite(ratioA)) return -1;
    if (!isFinite(ratioB)) return 1;
    return ratioA - ratioB;
  },
  progress: (a, b) => a.progress - b.progress,
};

interface Props {
  className?: string;
  onSelectTorrent: (id: SynapseId) => void;
}

export const ConnectedTorrentTable: React.FC<Props> = ({
  className,
  onSelectTorrent,
}) => {
  const { torrentIds, torrents, selection } = useSelector<State, Selected>(
    (s) => ({
      torrentIds: Object.keys(s.torrents) as SynapseId[],
      torrents: Object.values(s.torrents),
      selection: s.selection,
    }),
    (left, right) =>
      left.torrents.every((t) => right.torrents.includes(t)) &&
      left.selection === right.selection
  );

  const dispatch = useDispatch();

  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortMode, setSortMode] = useState<'ASC' | 'DESC'>('DESC');
  const handleSelectColumn = useCallback(
    (newColumn: SortColumn) => {
      if (sortColumn === newColumn) {
        setSortMode((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
      } else {
        setSortMode('DESC');
        setSortColumn(newColumn);
      }
    },
    [sortColumn]
  );

  const allSelected = selection.length === torrentIds.length;
  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      dispatch(selectTorrent([], EXCLUSIVE));
    } else {
      dispatch(selectTorrent(torrentIds, EXCLUSIVE));
    }
  }, [allSelected, dispatch]);

  const sortedTorrents = torrents
    .sort(
      (a, b) => COMPARATORS[sortColumn](a, b) * (sortMode === 'ASC' ? 1 : -1)
    )
    .map(({ id }) => id);

  const sameSortedTorrents = useRef(sortedTorrents);

  if (
    sortedTorrents !== sameSortedTorrents.current &&
    !sortedTorrents.every((e, i) => sameSortedTorrents.current[i] === e)
  ) {
    sameSortedTorrents.current = sortedTorrents;
  }

  return (
    <TorrentTable
      torrents={sameSortedTorrents.current}
      allSelected={allSelected}
      onSelectAll={handleSelectAll}
      sortColumn={sortColumn}
      sortMode={sortMode}
      onSelectColumn={handleSelectColumn}
      className={className}
      onSelectTorrent={onSelectTorrent}
    />
  );
};
