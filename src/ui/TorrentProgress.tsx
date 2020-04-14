import * as React from 'react';
import { Progress } from 'reactstrap';
import { TorrentStatus } from '../types/SynapseProtocol';

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

const label = (status: TorrentStatus, progress: number): string => {
  if (status === 'leeching') {
    return `${(progress * 100).toFixed(2)}%`;
  }

  if ((status === 'paused' || status === 'idle') && progress < 1) {
    return `paused (${(progress * 100).toFixed(2)}%)`;
  }

  return status;
};

interface Props {
  progress: number;
  status: TorrentStatus;
}

export const TorrentProgress: React.FC<Props> = ({ progress, status }) => (
  <Progress value={progress * 100} color={statusToColor[status]}>
    {label(status, progress)}
  </Progress>
);
