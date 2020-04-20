import React, { useEffect, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '../components/Stack';
import { TorrentInfo } from './TorrentInfo';
import { Columns } from '../components/Columns';
import { FiFolder, FiUsers, FiServer, FiSettings } from 'react-icons/fi';
import { Divider } from '../components/Divider';
import { Button } from '../components/Button';
import { FormHeader } from '../components/FormHeader';
import { TorrentDetailsOptions } from './TorrentDetailsOptions';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../types/Store';
import {
  SynapseId,
  TorrentResource,
  FileResource,
  TrackerResource,
  PeerResource,
} from '../types/SynapseProtocol';
import selectTorrent, { EXCLUSIVE } from '../actions/selection';

const useStyles = createUseStyles({});

interface Props {
  torrentId: SynapseId;
  onClose: () => void;
}

interface SelectorProps {
  torrent: TorrentResource;
  files: FileResource[];
  trackers: TrackerResource[];
  peers: PeerResource[];
}

export const TorrentDetails: React.FC<Props> = ({ torrentId, onClose }) => {
  const styles = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectTorrent([torrentId], EXCLUSIVE));
    return () => {
      dispatch(selectTorrent([], EXCLUSIVE, false));
    };
  }, [torrentId]);

  const { torrent, trackers, files, peers } = useSelector<State, SelectorProps>(
    (s) => ({
      torrent: s.torrents[torrentId],
      files: Object.values(s.files).filter((f) => f.torrent_id === torrentId),
      trackers: Object.values(s.trackers).filter(
        (f) => f.torrent_id === torrentId
      ),
      peers: Object.values(s.peers).filter((f) => f.torrent_id === torrentId),
    }),
    (left, right) =>
      left.torrent === right.torrent &&
      left.files.every((f) => right.files.includes(f)) &&
      left.trackers.every((t) => right.trackers.includes(t)) &&
      left.peers.every((t) => right.peers.includes(t))
  );

  if (!torrent) return null;

  const torrentDate = useMemo(() => new Date(torrent.created), [
    torrent.created,
  ]);

  return (
    <Stack spacing="16px" padding="16px">
      <FormHeader title="Torrent info" onClose={onClose} />
      <TorrentInfo
        name={torrent.name}
        size={torrent.size}
        isPrivate={torrent.private}
        comment={torrent.comment}
        creationDate={torrentDate}
        createdBy={torrent.creator}
      />
      <Divider />
      <Columns spacing="8px">
        <Button type="button">
          <FiSettings />
        </Button>
        <Button type="button">
          <FiFolder />
        </Button>
        <Button type="button">
          <FiUsers />
        </Button>
        <Button type="button">
          <FiServer />
        </Button>
      </Columns>
      <TorrentDetailsOptions
        path={torrent.path}
        setPath={() => {}}
        priority={torrent.priority}
        setPriority={() => {}}
        downloadStrategy={torrent.strategy}
        setDownloadStrategy={() => {}}
        downloadThrottle={{ type: 'GLOBAL' }}
        uploadThrottle={{ type: 'GLOBAL' }}
        setDownloadThrottle={() => {}}
        setUploadThrottle={() => {}}
      />
    </Stack>
  );
};
