import * as React from 'react';
import { FC, useState } from 'react';
import { AddTorrentSelect, SelectedTorrent } from './AddTorrentSelect';
import { TorrentOptions } from './TorrentOptions';
import { AddTorrentInfo } from './AddTorrentInfo';
import { Throttle } from './ThrottleBitrate';
import { Button } from '../components/Button';
import { Stack } from '../components/Stack';
import { Divider } from '../components/Divider';
import { TextSingleLine } from '../components/TextSingleLine';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    width: '400px',
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
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
}

export const AddTorrentForm: FC<Props> = ({ initialMagnet, onSubmit }) => {
  const [torrent, setTorrent] = useState<SelectedTorrent | null>(() =>
    initialMagnet
      ? { type: 'MAGNET', magnet: decodeURIComponent(initialMagnet) }
      : null
  );

  const [startImmediately, setStartImmediately] = useState(true);
  const [shouldImport, setShouldImport] = useState(false);
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
        <TextSingleLine bold>Add torrent</TextSingleLine>
        {torrent ? (
          <AddTorrentInfo torrent={torrent} onCancel={() => setTorrent(null)} />
        ) : (
          <AddTorrentSelect onSubmit={setTorrent} />
        )}
        <Divider />
        <TorrentOptions
          startImmediately={startImmediately}
          setStartImmediately={setStartImmediately}
          hasImport={!!torrent && torrent.type === 'FILE'}
          shouldImport={shouldImport}
          setShouldImport={setShouldImport}
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
