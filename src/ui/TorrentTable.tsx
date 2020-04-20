import React, { CSSProperties, useCallback } from 'react';
import { SynapseId } from '../types/SynapseProtocol';
import { ConnectedTorrentCard } from './ConnectedTorrentCard';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface RowProps {
  index: number;
  style: CSSProperties;
}

type SortColumn = 'name' | 'up' | 'down' | 'ul' | 'dl' | 'ratio' | 'progress';

interface Props {
  torrents: SynapseId[];
  allSelected: boolean;
  onSelectAll: () => void;
  sortColumn: SortColumn;
  sortMode: 'ASC' | 'DESC';
  onSelectColumn: (col: SortColumn) => void;
  className?: string;
  onSelectTorrent: (id: SynapseId) => void;
}

export const TorrentTable: React.FC<Props> = ({
  torrents,
  className,
  onSelectTorrent,
}) => {
  const itemKey = useCallback((index: number) => torrents[index], [torrents]);

  const Row = useCallback(
    ({ index, style }: RowProps) => {
      const id = torrents[index];

      const handleSelect = useCallback(() => onSelectTorrent(id), [
        id,
        onSelectTorrent,
      ]);

      return (
        <ConnectedTorrentCard
          id={id}
          style={style}
          odd={index % 2 !== 0}
          onSelect={handleSelect}
        />
      );
    },
    [torrents, onSelectTorrent]
  );

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeList
          height={height}
          itemSize={77}
          itemCount={torrents.length}
          width="100%"
          itemKey={itemKey}
          className={className}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};
