import React, { useState, useCallback, useEffect } from 'react';
import { ConnectedTorrentTable } from './ConnectedTorrentTable';
import { createUseStyles } from 'react-jss';
import { AddTorrent } from './AddTorrent';
import { TopBar } from './TopBar';
import { ConnectionOverlay } from './ConnectionOverlay';
import { SynapseId } from '../types/SynapseProtocol';
import { TorrentDetails } from './TorrentDetails';
import { ServerInfo } from './ServerInfo';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/Store';
import useAppDispatch from '../hooks/UseAppDispatch';
import { synapseInitSubscriptions } from '../redux/Synapse';
import {
  closeSidebar,
  showAddTorrent,
  showSettings,
  showTorrentInfo,
  SidebarState,
} from '../redux/Ui';

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
        'Inter UI',
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
    button: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Inter UI',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ],
      fontSize: '16px',
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

// type SidebarState =
//   | { state: 'ADD_TORRENT' }
//   | { state: 'SETTINGS' }
//   | { state: 'TORRENT_INFO'; torrent: SynapseId };

export function Layout() {
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => dispatch(closeSidebar()), []);

  const sidebarState = useSelector<AppState, SidebarState>((s) => s.ui.sidebar);

  const handleSelectTorrent = useCallback((torrent: SynapseId) => {
    dispatch(showTorrentInfo(torrent));
  }, []);

  const styles = useStyles({ isSidebarOpen: sidebarState.type !== 'CLOSED' });

  const isConnected = useSelector<AppState, boolean>(
    (s) => s.connectionStatus === 'CONNECTED'
  );

  useEffect(() => {
    if (!isConnected) return;
    dispatch(synapseInitSubscriptions());
  }, [isConnected]);

  return (
    <div className={styles.root}>
      <ConnectionOverlay />
      <div className={styles.main}>
        <div className={styles.header}>
          <TopBar
            onAddTorrent={() => dispatch(showAddTorrent())}
            onSettings={() => dispatch(showSettings())}
          />
        </div>
        <div className={styles.torrents}>
          <ConnectedTorrentTable onSelectTorrent={handleSelectTorrent} />
        </div>
      </div>
      {sidebarState.type !== 'CLOSED' && (
        <aside className={styles.sidebar}>
          {sidebarState.type === 'ADD_TORRENT' ? (
            <AddTorrent onClose={handleClose} />
          ) : sidebarState.type === 'TORRENT_INFO' ? (
            <TorrentDetails
              key={sidebarState.torrent}
              torrentId={sidebarState.torrent}
              onClose={handleClose}
            />
          ) : (
            <ServerInfo onClose={handleClose} />
          )}
        </aside>
      )}
    </div>
  );
}
