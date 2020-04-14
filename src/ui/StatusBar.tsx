import React, { memo } from 'react';
import { createUseStyles } from 'react-jss';
import { formatBitrate } from '../Bitrate';

const useStyles = createUseStyles({
  statusBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    backgroundColor: '#393939',
    borderTop: '2px solid #202020',
    padding: ['4px', '8px'],
    fontSize: '.8rem',
  },
});

interface Props {
  rateUp: number;
  rateDown: number;
  torrentCount: number;
}

export const StatusBar: React.FC<Props> = memo(function StatusBar({
  rateUp,
  rateDown,
  torrentCount,
}) {
  const styles = useStyles();

  return (
    <div className={styles.statusBar}>
      <div>{torrentCount} torrents</div>
      <div>
        DL: {formatBitrate(rateDown)} UL: {formatBitrate(rateUp)}
      </div>
    </div>
  );
});
