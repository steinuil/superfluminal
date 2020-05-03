import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '../components/Stack';
import { TorrentInfo } from './TorrentInfo';
import { Columns } from '../components/Columns';
import { FiFolder, FiUsers, FiServer, FiSettings } from 'react-icons/fi';
import { Divider } from '../components/Divider';
import { Button } from '../components/Button';
import { FormHeader } from '../components/FormHeader';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { State } from '../types/Store';
import { SynapseId } from '../types/SynapseProtocol';
import { c } from '../ClassNames';
import { useToggle } from '../hooks/UseToggle';
import { DeleteTorrentForm } from './DeleteTorrentForm';
import ws_send from '../socket';
import { selectTorrents } from '../actions/Selection';
import { TorrentDetailsOptionsController } from './TorrentDetailsOptionsController';
import { TorrentDetailsFilesController } from './TorrentDetailsFilesController';
import { TorrentDetailsPeersController } from './TorrentDetailsPeersController';
import { TorrentDetailsTrackersController } from './TorrentDetailsTrackersController';

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
  name: string | null;
  size: number | null;
  comment: string;
  created: string;
  creator: string;
  isPrivate: boolean;
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

  const { name, size, comment, created, creator, isPrivate } = useSelector<
    State,
    SelectorProps
  >((s) => {
    const i = s.torrents.id.indexOf(torrentId);

    return {
      name: s.torrents.name[i],
      size: s.torrents.size[i],
      comment: s.torrents.comment[i],
      created: s.torrents.created[i],
      creator: s.torrents.creator[i],
      isPrivate: s.torrents.private[i],
    };
  }, shallowEqual);

  const torrentDate = useMemo(() => new Date(created), [created]);

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
        id: torrentId,
        artifacts: alsoDeleteFiles,
      });
    },
    [torrentId, onClose, alsoDeleteFiles]
  );

  return (
    <Stack spacing="16px" padding="16px">
      <FormHeader title="Torrent info" onClose={onClose} />
      <TorrentInfo
        name={name}
        size={size}
        isPrivate={isPrivate}
        comment={comment}
        creationDate={torrentDate}
        createdBy={creator}
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
        <TorrentDetailsOptionsController id={torrentId} />
      ) : selectedTab === 'FILES' ? (
        <TorrentDetailsFilesController id={torrentId} />
      ) : selectedTab === 'TRACKERS' ? (
        <TorrentDetailsTrackersController id={torrentId} />
      ) : (
        <TorrentDetailsPeersController id={torrentId} />
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
