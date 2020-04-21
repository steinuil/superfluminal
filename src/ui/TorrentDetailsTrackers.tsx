import React, { FC } from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '../components/Stack';
import { TrackerResource } from '../types/SynapseProtocol';

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
});

interface TrackerProps {
  url: string;
  lastReport: string;
  error: string | null;
}

const Tracker: FC<TrackerProps> = ({ url, lastReport, error }) => {
  const date = new Date(lastReport).toLocaleString();

  const styles = useStyles();

  return (
    <Stack spacing="2px">
      <div className={styles.url}>{url}</div>
      <div className={styles.lastReport}>Last announce: {date}</div>
      {error && <div className={styles.error}>{error}</div>}
    </Stack>
  );
};

interface Props {
  trackers: TrackerResource[];
}

export const TorrentDetailsTrackers: React.FC<Props> = ({ trackers }) => {
  const sortedTrackers = trackers
    .slice()
    .sort((left, right) => left.url.localeCompare(right.url));

  return (
    <Stack spacing="8px">
      {sortedTrackers.map(({ url, last_report, error }) => (
        <Tracker key={url} url={url} lastReport={last_report} error={error} />
      ))}
    </Stack>
  );
};
