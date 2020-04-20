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
import { TorrentInfo } from './TorrentInfo';
import { LongText } from './LongText';

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
    <TorrentInfo
      name={info.name}
      size={info.length}
      isPrivate={info.private}
      comment={info.comment}
      creationDate={info.creationDate}
      createdBy={info.createdBy}
    />
  ) : (
    <TextSingleLine>Parsing .torrent file...</TextSingleLine>
  );
};

interface Props {
  torrent: SelectedTorrent;
  onCancel: () => void;
}

export const AddTorrentInfo: React.FC<Props> = ({ torrent, onCancel }) => (
  <Stack spacing="16px">
    <LongText>
      {torrent.type === 'FILE' ? torrent.file.name : torrent.magnet}
    </LongText>
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
