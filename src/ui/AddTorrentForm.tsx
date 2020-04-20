import * as React from 'react';
import { FC, useState } from 'react';
import { AddTorrentSelect, SelectedTorrent } from './AddTorrentSelect';
import { AddTorrentOptions } from './AddTorrentOptions';
import { AddTorrentInfo } from './AddTorrentInfo';
import { Throttle } from './ThrottleBitrate';
import { Button } from '../components/Button';
import { Stack } from '../components/Stack';
import { Divider } from '../components/Divider';
import { TextSingleLine } from '../components/TextSingleLine';
import { createUseStyles } from 'react-jss';
import { Columns } from '../components/Columns';
import { FiX } from 'react-icons/fi';
import { onKeyboardSelect } from '../EventHelpers';
import { useToggle } from '../hooks/UseToggle';

const useStyles = createUseStyles({
  container: {
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  title: {
    flexGrow: 1,
  },
  closeButton: {
    flexShrink: 0,
    display: 'block',
  },
});

export interface TorrentOptions {
  startImmediately: boolean;
  shouldImport: boolean;
  path: string | null;
  priority: 1 | 2 | 3 | 4 | 5;
  downloadStrategy: string;
  downloadThrottle: Throttle;
  uploadThrottle: Throttle;
}

interface Props {
  initialMagnet?: string;
  onSubmit: (torrent: SelectedTorrent, options: TorrentOptions) => void;
  onClose: () => void;
}

export const AddTorrentForm: FC<Props> = ({
  initialMagnet,
  onSubmit,
  onClose,
}) => {
  const [torrent, setTorrent] = useState<SelectedTorrent | null>(() =>
    initialMagnet
      ? { type: 'MAGNET', magnet: decodeURIComponent(initialMagnet) }
      : null
  );

  const [startImmediately, toggleStartImmediately] = useToggle(true);
  const [shouldImport, toggleShouldImport] = useToggle(false);
  const [path, setPath] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [downloadStrategy, setDownloadStrategy] = useState('rarest');
  const [downloadThrottle, setDownloadThrottle] = useState<Throttle>({
    type: 'GLOBAL',
  });
  const [uploadThrottle, setUploadThrottle] = useState<Throttle>({
    type: 'GLOBAL',
  });

  const handleSubmit = () => {
    if (!torrent) return;
    onSubmit(torrent, {
      startImmediately,
      shouldImport,
      path: path || null,
      priority,
      downloadStrategy,
      downloadThrottle,
      uploadThrottle,
    });
  };

  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Stack spacing="16px" padding="16px">
        <Columns spacing="8px">
          <TextSingleLine bold fontSize="18px" className={styles.title}>
            Add torrent
          </TextSingleLine>
          <FiX
            size="24px"
            className={styles.closeButton}
            tabIndex={0}
            onClick={onClose}
            onKeyDown={onKeyboardSelect(onClose)}
          />
        </Columns>
        {torrent ? (
          <AddTorrentInfo torrent={torrent} onCancel={() => setTorrent(null)} />
        ) : (
          <AddTorrentSelect onSubmit={setTorrent} />
        )}
        <Divider />
        <AddTorrentOptions
          startImmediately={startImmediately}
          toggleStartImmediately={toggleStartImmediately}
          hasImport={!!torrent && torrent.type === 'FILE'}
          shouldImport={shouldImport}
          toggleShouldImport={toggleShouldImport}
          path={path}
          setPath={setPath}
          priority={priority}
          setPriority={setPriority}
          downloadStrategy={downloadStrategy}
          setDownloadStrategy={setDownloadStrategy}
          downloadThrottle={downloadThrottle}
          setDownloadThrottle={setDownloadThrottle}
          uploadThrottle={uploadThrottle}
          setUploadThrottle={setUploadThrottle}
        />
        <Divider />
        <Button
          type="submit"
          disabled={torrent === null}
          onClick={handleSubmit}
        >
          Add torrent
        </Button>
      </Stack>
    </div>
  );
};
