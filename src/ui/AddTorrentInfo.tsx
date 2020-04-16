import React, { useCallback } from 'react';
import { SelectedTorrent } from './AddTorrentSelect';
import { readMagnet } from '../ReadMagnet';
import { usePromise } from '../hooks/UsePromise';
import { readTorrentFile } from '../ReadTorrentFile';
import { Stack } from '../components/Stack';
import { Button } from '../components/Button';
import { Definition } from '../components/Definition';
import { fmtSizeBin } from '../Units';
import { TextSingleLine } from '../components/TextSingleLine';

interface MagnetInfoProps {
  magnet: string;
}

const MagnetInfo: React.FC<MagnetInfoProps> = ({ magnet }) => {
  const info = readMagnet(magnet);

  return (
    <Stack spacing="8px">
      {info.name && <Definition label="Name">{info.name}</Definition>}
      {info.length && (
        <Definition label="Size">{fmtSizeBin(info.length)}</Definition>
      )}
    </Stack>
  );
};

interface TorrentFileInfoProps {
  file: File;
}

const TorrentFileInfo: React.FC<TorrentFileInfoProps> = ({ file }) => {
  const getTorrentInfo = useCallback(() => readTorrentFile(file), [file]);
  const info = usePromise(getTorrentInfo);

  return info ? (
    <Stack spacing="8px">
      <Definition label="Name">{info.name}</Definition>
      <Definition label="Size">{fmtSizeBin(info.length)}</Definition>
      <Definition label="Type">
        {info.private ? 'Private' : 'Public'}
      </Definition>
      {info.comment && <Definition label="Comment">{info.comment}</Definition>}
      {info.createdBy && (
        <Definition label="Creator">{info.createdBy}</Definition>
      )}
    </Stack>
  ) : (
    <TextSingleLine>Loading...</TextSingleLine>
  );
};

interface Props {
  torrent: SelectedTorrent;
  onCancel: () => void;
}

export const AddTorrentInfo: React.FC<Props> = ({ torrent, onCancel }) => (
  <Stack spacing="16px">
    <div>{torrent.type === 'FILE' ? torrent.file.name : torrent.magnet}</div>
    {torrent.type === 'FILE' ? (
      <TorrentFileInfo file={torrent.file} />
    ) : (
      <MagnetInfo magnet={torrent.magnet} />
    )}
    <Button type="button" onClick={onCancel}>
      Select a different torrent
    </Button>
  </Stack>
);
