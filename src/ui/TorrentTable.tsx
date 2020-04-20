import React, { CSSProperties, useCallback } from 'react';
import { SynapseId } from '../types/SynapseProtocol';
import { ConnectedTorrentCard } from './ConnectedTorrentCard';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface RowProps {
  index: number;
  style: CSSProperties;
  data: SynapseId[];
}

const Row: React.FC<RowProps> = ({ index, style, data: torrents }) => (
  <ConnectedTorrentCard
    id={torrents[index]}
    style={style}
    odd={index % 2 !== 0}
  />
);

type SortColumn = 'name' | 'up' | 'down' | 'ul' | 'dl' | 'ratio' | 'progress';

interface Props {
  torrents: SynapseId[];
  allSelected: boolean;
  onSelectAll: () => void;
  sortColumn: SortColumn;
  sortMode: 'ASC' | 'DESC';
  onSelectColumn: (col: SortColumn) => void;
  className?: string;
}

export const TorrentTable: React.FC<Props> = ({ torrents, className }) => {
  const itemKey = useCallback(
    (index: number, data: SynapseId[]) => data[index],
    [torrents]
  );

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeList
          height={height}
          itemSize={77}
          itemCount={torrents.length}
          itemData={torrents}
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
