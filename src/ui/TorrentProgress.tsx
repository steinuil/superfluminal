import * as React from 'react';
import { Progress } from 'reactstrap';

type TorrentStatus =
  | 'leeching'
  | 'seeding'
  | 'hashing'
  | 'magnet'
  | 'idle'
  | 'pending'
  | 'paused'
  | 'error';

interface Torrent {
  status: TorrentStatus;
  progress: number;
}

const statusToColor: { [S in TorrentStatus]: string } = {
  leeching: 'success',
  seeding: 'primary',
  hashing: 'info',
  magnet: 'info',
  idle: 'default',
  pending: 'default',
  paused: 'default',
  error: 'error',
};

const label = (torrent: Torrent): string => {
  if (torrent.status === 'leeching') {
    return `${(torrent.progress * 100).toFixed(2)}%`;
  }

  if (
    (torrent.status === 'paused' || torrent.status === 'idle') &&
    torrent.progress < 1
  ) {
    return `paused (${(torrent.progress * 100).toFixed(2)}%)`;
  }

  return torrent.status;
};

interface Props {
  torrent: Torrent;
}

export const TorrentProgress: React.FC<Props> = ({ torrent }) => (
  <Progress
    value={torrent.progress * 100}
    color={statusToColor[torrent.status]}
  >
    {label(torrent)}
  </Progress>
);
