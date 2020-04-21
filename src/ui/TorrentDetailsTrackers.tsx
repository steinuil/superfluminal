import React, { FC } from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '../components/Stack';
import { TrackerResource, SynapseId } from '../types/SynapseProtocol';
import { Columns } from '../components/Columns';
import { FiRefreshCw } from 'react-icons/fi';
import { onKeyboardSelect } from '../EventHelpers';
import ws_send from '../socket';

const useStyles = createUseStyles({
  url: {
    wordBreak: 'break-all',
    lineHeight: '1.2em',
  },
  lastReport: {
    fontSize: '13px',
    lineHeight: '1.2em',
  },
  error: {
    fontSize: '13px',
    color: 'red',
    lineHeight: '1.2em',
  },
  refreshButton: {
    cursor: 'pointer',
  },
});

interface TrackerProps {
  url: string;
  lastReport: string;
  error: string | null;
  onRefresh: () => void;
}

const Tracker: FC<TrackerProps> = ({ url, lastReport, error, onRefresh }) => {
  const date = new Date(lastReport).toLocaleString();

  const styles = useStyles();

  return (
    <Columns spacing="8px">
      <Stack spacing="2px">
        <div className={styles.url}>{url}</div>
        <div className={styles.lastReport}>Last announce: {date}</div>
        {error && <div className={styles.error}>{error}</div>}
      </Stack>
      <FiRefreshCw
        className={styles.refreshButton}
        tabIndex={0}
        role="button"
        onClick={onRefresh}
        onKeyDown={onKeyboardSelect(onRefresh)}
        title="Update tracker"
      />
    </Columns>
  );
};

interface Props {
  trackers: TrackerResource[];
}

export const TorrentDetailsTrackers: React.FC<Props> = ({ trackers }) => {
  const sortedTrackers = trackers
    .slice()
    .sort((left, right) => left.url.localeCompare(right.url));

  const handleRefresh = (id: SynapseId) => ws_send('UPDATE_TRACKER', { id });

  return (
    <Stack spacing="8px">
      {sortedTrackers.map(({ id, url, last_report, error }) => (
        <Tracker
          key={id}
          url={url}
          lastReport={last_report}
          error={error}
          onRefresh={() => handleRefresh(id)}
        />
      ))}
    </Stack>
  );
};
