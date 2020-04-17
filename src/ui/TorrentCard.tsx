import React, { useMemo, memo } from 'react';
import { TorrentStatus } from '../types/SynapseProtocol';
import { formatAmount, formatBitrate } from '../Bitrate';
import { createUseStyles } from 'react-jss';
import {
  fmtSizeBin,
  fmtRemaining,
  fmtProgress,
  fmtBitrateBin,
  fmtRatio,
} from '../Units';
import { FiPauseCircle, FiPlayCircle, FiInfo } from 'react-icons/fi';
import { stopPropagation, onKeyboardSelect } from '../EventHelpers';
import { ProgressBar } from './ProgressBar';

interface StyleProps {
  selected: boolean;
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
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    borderBottom: '1px solid #4f4446',
    boxSizing: 'border-box',
  },
  buttons: {
    flexShrink: 0,
    padding: '8px 8px 8px 0',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  button: {
    width: '1.5rem',
    height: '1.5rem',
    '&:not(:last-child)': {
      marginBottom: '8px',
    },
  },
  card: {
    height: '60px',
    padding: '8px',
    flexGrow: 1,
    overflowY: 'hidden',
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
  onTogglePaused: () => void;
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
  onTogglePaused,
}) {
  const done = fmtProgress(progress);
  const ratio = transferredUp / transferredDown;

  const info: string = useMemo(() => {
    switch (status) {
      case 'pending':
        return [
          fmtSizeBin(transferredDown),
          'of',
          fmtSizeBin(size || 0),
          `(${done})`,
        ].join(' ');
      case 'leeching': {
        const remaining = size
          ? fmtRemaining({ size, transferredDown, rateDown })
          : null;

        return `${fmtSizeBin(transferredDown)} of ${fmtSizeBin(
          size || 0
        )} (${done}) - DL: ${fmtBitrateBin(rateDown)}, UL: ${fmtBitrateBin(
          rateUp
        )} - ${remaining} remaining`;
      }
      case 'paused':
        if (progress < 1) {
          return `${fmtSizeBin(transferredDown)} of ${fmtSizeBin(
            size || 0
          )} (${done})`;
        }
        return `${fmtSizeBin(size || 0)}, uploaded ${fmtSizeBin(
          transferredUp
        )} (Ratio: ${fmtRatio(ratio)})`;
      case 'seeding':
      case 'idle':
        return `${formatAmount(size || 0)}, uploaded ${formatAmount(
          transferredUp
        )} (Ratio: ${fmtRatio(ratio)}) - UL: ${formatBitrate(rateUp)}`;
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
        <ProgressBar availability={availability} progress={progress} />
      </div>
      <div className={styles.buttons}>
        {status === 'paused' ? (
          <FiPlayCircle
            className={styles.button}
            tabIndex={0}
            onClick={stopPropagation(onTogglePaused)}
            onKeyDown={onKeyboardSelect(onTogglePaused)}
          />
        ) : (
          <FiPauseCircle
            className={styles.button}
            tabIndex={0}
            onClick={stopPropagation(onTogglePaused)}
            onKeyDown={onKeyboardSelect(onTogglePaused)}
          />
        )}
        <FiInfo className={styles.button} />
      </div>
    </div>
  );
});
