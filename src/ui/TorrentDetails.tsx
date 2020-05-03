import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import selectTorrent, { EXCLUSIVE } from '../actions/selectionOld';
import { TorrentDetailsFiles } from './TorrentDetailsFiles';
import { TorrentDetailsTrackers } from './TorrentDetailsTrackers';
import { TorrentDetailsPeers } from './TorrentDetailsPeers';
import { c } from '../ClassNames';
import { useToggle } from '../hooks/UseToggle';
import { DeleteTorrentForm } from './DeleteTorrentForm';
import ws_send from '../socket';
import { useThrottle } from '../hooks/UseThrottle';
import { updateResource } from '../actions/resources';
import { selectTorrents } from '../actions/Selection';

const useStyles = createUseStyles({
  selectedTab: {
    backgroundColor: '#40c9db',
    color: 'black',
  },
});

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
    dispatch(selectTorrents([torrentId]));
    return () => {
      dispatch(selectTorrents([]));
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
    // not very fast
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

  const [selectedTab, setSelectedTab] = useState<
    'SETTINGS' | 'FILES' | 'PEERS' | 'TRACKERS'
  >('SETTINGS');

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alsoDeleteFiles, setAlsoDeleteFiles] = useToggle(false);

  const openModal = useCallback(() => {
    setDeleteModalOpen(true);
    setAlsoDeleteFiles(false);
  }, []);

  const handleCloseModal = useCallback(
    (shouldDelete: boolean | null) => {
      setDeleteModalOpen(false);
      if (!shouldDelete) return;
      onClose();
      ws_send('REMOVE_RESOURCE', {
        id: torrent.id,
        artifacts: alsoDeleteFiles,
      });
    },
    [torrent, onClose, alsoDeleteFiles]
  );

  const [path, setPath] = useState(torrent.path);
  const pathModified = path !== torrent.path;
  const [priority, setPriority] = useState(torrent.priority);
  const priorityModified = priority !== torrent.priority;
  const [strategy, setStrategy] = useState(torrent.strategy);
  const strategyModified = strategy !== torrent.strategy;

  // Throttle doesn't seem to work right
  const [dlThrottle, setDlThrottle, dlThrottleRaw] = useThrottle(
    torrent.throttle_down
  );
  const dlThrottleModified = torrent.throttle_down !== dlThrottleRaw;
  const [ulThrottle, setUlThrottle, ulThrottleRaw] = useThrottle(
    torrent.throttle_up
  );
  const ulThrottleModified = torrent.throttle_up !== ulThrottleRaw;

  const handleValidateResources = () =>
    ws_send('VALIDATE_RESOURCES', { ids: [torrentId] });

  const canUpdateSettings =
    pathModified ||
    priorityModified ||
    strategyModified ||
    dlThrottleModified ||
    ulThrottleModified;

  const handleUpdateSettings = () => {
    dispatch(
      updateResource({
        id: torrentId,
        path: pathModified ? path : undefined,
        priority: priorityModified ? priority : undefined,
        strategy: strategyModified ? strategy : undefined,
        throttle_up: ulThrottleModified ? ulThrottleRaw : undefined,
        throttle_down: dlThrottleModified ? dlThrottleRaw : undefined,
      })
    );
  };

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
      <Button type="button" onClick={openModal}>
        Delete torrent
      </Button>
      <Divider />
      <Columns spacing="8px">
        <Button
          type="button"
          onClick={() => setSelectedTab('SETTINGS')}
          className={c(selectedTab === 'SETTINGS' && styles.selectedTab)}
        >
          <FiSettings />
        </Button>
        <Button
          type="button"
          onClick={() => setSelectedTab('FILES')}
          className={c(selectedTab === 'FILES' && styles.selectedTab)}
        >
          <FiFolder />
        </Button>
        <Button
          type="button"
          onClick={() => setSelectedTab('PEERS')}
          className={c(selectedTab === 'PEERS' && styles.selectedTab)}
        >
          <FiUsers />
        </Button>
        <Button
          type="button"
          onClick={() => setSelectedTab('TRACKERS')}
          className={c(selectedTab === 'TRACKERS' && styles.selectedTab)}
        >
          <FiServer />
        </Button>
      </Columns>
      {selectedTab === 'SETTINGS' ? (
        <TorrentDetailsOptions
          path={path}
          setPath={setPath}
          pathModified={pathModified}
          priority={priority}
          setPriority={setPriority}
          priorityModified={priorityModified}
          downloadStrategy={strategy}
          setDownloadStrategy={setStrategy}
          strategyModified={strategyModified}
          downloadThrottle={dlThrottle}
          uploadThrottle={ulThrottle}
          setDownloadThrottle={setDlThrottle}
          setUploadThrottle={setUlThrottle}
          downloadThrottleModified={dlThrottleModified}
          uploadThrottleModified={ulThrottleModified}
          onSubmit={handleUpdateSettings}
          submitDisabled={!canUpdateSettings}
        />
      ) : selectedTab === 'FILES' ? (
        <TorrentDetailsFiles
          files={files}
          onValidate={handleValidateResources}
        />
      ) : selectedTab === 'TRACKERS' ? (
        <TorrentDetailsTrackers trackers={trackers} />
      ) : (
        <TorrentDetailsPeers peers={peers} />
      )}
      {isDeleteModalOpen && (
        <DeleteTorrentForm
          onDelete={handleCloseModal}
          alsoDeleteFiles={alsoDeleteFiles}
          toggleAlsoDeleteFiles={setAlsoDeleteFiles}
        />
      )}
    </Stack>
  );
};
