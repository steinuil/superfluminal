import React, { useState, useCallback } from 'react';
import { ConnectedTorrentTable } from './ConnectedTorrentTable';
import { createUseStyles } from 'react-jss';
import { AddTorrent } from './AddTorrent';
import { TopBar } from './TopBar';
import { ConnectionOverlay } from './ConnectionOverlay';
import { SynapseId } from '../types/SynapseProtocol';
import { TorrentDetails } from './TorrentDetails';
import { ServerInfo } from './ServerInfo';

interface StyleProps {
  isSidebarOpen: boolean;
}

const useStyles = createUseStyles({
  '@global': {
    '*': {
      margin: '0',
      padding: '0',
      border: '0',
      boxSizing: 'border-box',
    },
    body: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ],
      fontSize: '16px',
      lineHeight: '24px',
      backgroundColor: '#2d2d2d',
      color: '#c4c8cc',
      scrollbarColor: '#555a5e #2d2d2d',
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    '@media (max-width: 575.98px)': {
      display: (props: StyleProps) => (props.isSidebarOpen ? 'none' : 'flex'),
    },
  },
  header: {
    flexShrink: 0,
  },
  torrents: {
    flexGrow: 1,
  },
  footer: {
    flexShrink: 0,
  },
  sidebar: {
    flexShrink: 0,
    flexGrow: 1,
    borderLeft: '1px solid #3f4446',
    minWidth: '250px',
    maxWidth: '400px',
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    '@media (max-width: 575.98px)': {
      borderLeft: 0,
      maxWidth: '100%',
    },
  },
});

interface Props {}

type SidebarState =
  | { state: 'ADD_TORRENT' }
  | { state: 'SETTINGS' }
  | { state: 'TORRENT_INFO'; torrent: SynapseId };

export const Layout: React.FC<Props> = () => {
  const [sidebar, setSidebar] = useState<SidebarState | null>(null);

  const handleClose = useCallback(() => setSidebar(null), []);

  const handleSelectTorrent = useCallback((torrent: SynapseId) => {
    setSidebar({ state: 'TORRENT_INFO', torrent });
  }, []);

  const styles = useStyles({ isSidebarOpen: sidebar !== null });

  return (
    <div className={styles.root}>
      <ConnectionOverlay />
      <div className={styles.main}>
        <div className={styles.header}>
          <TopBar
            onAddTorrent={() => setSidebar({ state: 'ADD_TORRENT' })}
            onSettings={() => setSidebar({ state: 'SETTINGS' })}
          />
        </div>
        <div className={styles.torrents}>
          <ConnectedTorrentTable onSelectTorrent={handleSelectTorrent} />
        </div>
      </div>
      {sidebar && (
        <aside className={styles.sidebar}>
          {sidebar.state === 'ADD_TORRENT' ? (
            <AddTorrent onClose={handleClose} />
          ) : sidebar.state === 'TORRENT_INFO' ? (
            <TorrentDetails
              key={sidebar.torrent}
              torrentId={sidebar.torrent}
              onClose={handleClose}
            />
          ) : (
            <ServerInfo onClose={handleClose} />
          )}
        </aside>
      )}
    </div>
  );
};
