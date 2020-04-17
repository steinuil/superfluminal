import React from 'react';
import { ConnectedTorrentTable } from './ConnectedTorrentTable';
import { ConnectedStatusBar } from './ConnectedStatusBar';
import { createUseStyles } from 'react-jss';
import { AddTorrent } from './AddTorrent';
import { TopBar } from './TopBar';
import { ConnectionOverlay } from './ConnectionOverlay';

const useStyles = createUseStyles({
  '@global': {
    '*': {
      margin: '0',
      padding: '0',
      border: '0',
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
    borderLeft: '1px solid #3f4446',
  },
});

interface Props {}

export const Layout: React.FC<Props> = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <ConnectionOverlay />
      <div className={styles.main}>
        <div className={styles.header}>
          <TopBar />
        </div>
        <div className={styles.torrents}>
          <ConnectedTorrentTable />
        </div>
        {/* <div className={styles.footer}>
          <ConnectedStatusBar />
        </div> */}
      </div>
      <aside className={styles.sidebar}>
        <AddTorrent match={{ params: {} }} />
      </aside>
    </div>
  );
};
