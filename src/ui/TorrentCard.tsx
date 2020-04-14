import React, { useMemo, memo } from 'react';
import { TorrentStatus } from '../types/SynapseProtocol';
import { formatAmount, formatBitrate } from '../Bitrate';
import { createUseStyles } from 'react-jss';

interface StyleProps {
  selected: boolean;
  done: string;
  availability: string;
  odd: boolean;
}

const useStyles = createUseStyles({
  container: {
    cursor: 'pointer',
    backgroundColor: (props: StyleProps) => {
      if (props.selected) return '#404345';
      if (props.odd) return '#303030';
      return '#2d2d2d';
    },
  },
  card: {
    height: '60px',
    padding: '8px',
  },
  title: {
    fontSize: '.9rem',
    height: '24px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  info: {
    fontSize: '.8rem',
    height: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressContainer: {
    height: '14px',
    width: '100%',
    backgroundColor: '#EEE',
    position: 'relative',
    marginTop: '4px',
  },
  availabilityBar: {
    backgroundColor: '#CCC',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: (props: StyleProps) => `${props.availability}%`,
  },
  progressBar: {
    backgroundColor: '#40c9db',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: (props: StyleProps) => `${props.done}%`,
  },
  progressShadow: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    left: '0',
    height: '7px',
    backgroundColor: 'black',
    opacity: 0.1,
  },
  progressBorder: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    border: '1px solid rgba(0, 0, 0, 0.25)',
  },
});

interface Props {
  name: string | null;
  status: TorrentStatus;
  size: number | null;
  transferredUp: number;
  transferredDown: number;
  rateUp: number;
  rateDown: number;
  progress: number;
  availability: number;
  selected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
  odd: boolean;
}

export const TorrentCard: React.FC<Props> = memo(function TorrentCard({
  name,
  status,
  size,
  transferredDown,
  transferredUp,
  progress,
  rateDown,
  rateUp,
  availability,
  selected,
  onSelect,
  style,
  odd,
}) {
  const done = (progress * 100).toFixed(2);
  const ratio = transferredUp / transferredDown;

  const info: string = useMemo(() => {
    switch (status) {
      case 'pending':
        return [
          formatAmount(transferredDown),
          'of',
          formatAmount(size || 0),
          `(${done}%)`,
        ].join(' ');
      case 'leeching': {
        const remaining = size
          ? Math.ceil((size - transferredDown) / rateDown / 60)
          : null;

        return `${formatAmount(transferredDown)} of ${formatAmount(
          size || 0
        )} (${done}%) - DL: ${formatBitrate(rateDown)}, UL: ${formatBitrate(
          rateUp
        )} - ${remaining} minutes remaining`;
      }
      case 'paused':
        if (progress < 1) {
          return `${formatAmount(transferredDown)} of ${
            size ? formatAmount(size) : '??'
          } (${done}%)`;
        }
        return `${formatAmount(size || 0)}, uploaded ${formatAmount(
          transferredUp
        )} (Ratio: ${isFinite(ratio) ? ratio.toFixed(2) : '∞'})`;
      case 'seeding':
      case 'idle':
        return `${formatAmount(size || 0)}, uploaded ${formatAmount(
          transferredUp
        )} (Ratio: ${
          isFinite(ratio) ? ratio.toFixed(2) : '∞'
        }) - UL: ${formatBitrate(rateUp)}`;
      case 'hashing':
      case 'magnet':
      case 'error':
        return `a`;
    }
  }, [
    status,
    size,
    transferredDown,
    transferredUp,
    progress,
    rateDown,
    rateUp,
  ]);

  const styles = useStyles({
    selected,
    availability: (availability * 100).toFixed(2),
    done,
    odd,
  });

  return (
    <div
      className={styles.container}
      onClick={onSelect}
      style={style}
      tabIndex={0}
    >
      <div className={styles.card}>
        <div className={styles.title}>{name}</div>
        <div className={styles.info}>{info}</div>
        <div className={styles.progressContainer}>
          <div className={styles.availabilityBar} />
          <div className={styles.progressBar} />
          <div className={styles.progressShadow} />
          <div className={styles.progressBorder} />
        </div>
      </div>
    </div>
  );
});
