import React, { useCallback } from 'react';
import { SelectedTorrent } from './AddTorrentSelect';
import { Card, CardTitle, Button, Spinner } from 'reactstrap';
import { readMagnet } from '../ReadMagnet';
import { usePromise } from '../hooks/UsePromise';
import { readTorrentFile } from '../ReadTorrentFile';
import { formatAmount } from '../Bitrate';

interface MagnetInfoProps {
  magnet: string;
}

const MagnetInfo: React.FC<MagnetInfoProps> = ({ magnet }) => {
  const info = readMagnet(magnet);

  return (
    <dl>
      {info.name && (
        <>
          <dt>Name</dt>
          <dd>{info.name}</dd>
        </>
      )}
      {info.length && (
        <>
          <dt>Size</dt>
          <dd>{info.length}</dd>
        </>
      )}
    </dl>
  );
};

interface TorrentFileInfoProps {
  file: File;
}

const TorrentFileInfo: React.FC<TorrentFileInfoProps> = ({ file }) => {
  const getTorrentInfo = useCallback(() => readTorrentFile(file), [file]);
  const info = usePromise(getTorrentInfo);

  return info ? (
    <dl>
      <dt>Name</dt>
      <dd>{info.name}</dd>
      <dt>Size</dt>
      <dd>{formatAmount(info.length)}</dd>
      <dt>Type</dt>
      <dd>{info.private ? 'Private' : 'Public'}</dd>
      <dt>Comment</dt>
      <dd>{info.comment || 'None'}</dd>
      <dt>Creator</dt>
      <dd>{info.createdBy || 'None'}</dd>
    </dl>
  ) : (
    <Spinner />
  );
};

interface Props {
  torrent: SelectedTorrent;
  onCancel: () => void;
}

export const AddTorrentInfo: React.FC<Props> = ({ torrent, onCancel }) => (
  <Card body>
    <CardTitle>
      {torrent.type === 'FILE' ? torrent.file.name : torrent.magnet}
    </CardTitle>
    {torrent.type === 'FILE' ? (
      <TorrentFileInfo file={torrent.file} />
    ) : (
      <MagnetInfo magnet={torrent.magnet} />
    )}
    <Button block outline onClick={onCancel}>
      Select a different torrent
    </Button>
  </Card>
);
