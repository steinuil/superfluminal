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
import { Columns } from '../components/Columns';
import { Stack } from '../components/Stack';
import { TextSingleLine } from '../components/TextSingleLine';

interface StyleProps {
  selected: boolean;
  odd: boolean;
}

const useStyles = createUseStyles({
  container: {
    backgroundColor: (props: StyleProps) => {
      if (props.selected) return '#404345';
      if (props.odd) return '#303030';
      return '#2d2d2d';
    },
    padding: '8px',
    borderBottom: '1px solid #4f4446',
  },
  buttons: {
    flexShrink: 0,
    width: 'auto',
  },
  button: {
    display: 'block',
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.5rem',
  },
  card: {
    height: '60px',
    paddingTop: '4px',
    flexGrow: 1,
    overflowY: 'hidden',
  },
  title: {
    paddingBottom: '2px',
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
    <Columns spacing="8px" className={styles.container} style={style}>
      <Stack spacing="8px" className={styles.card}>
        <TextSingleLine className={styles.title}>{name}</TextSingleLine>
        <TextSingleLine fontSize="13px">{info}</TextSingleLine>
        <ProgressBar availability={availability} progress={progress} />
      </Stack>
      <Stack spacing="8px" className={styles.buttons}>
        {status === 'paused' ? (
          <FiPlayCircle
            className={styles.button}
            tabIndex={0}
            role="button"
            onClick={stopPropagation(onTogglePaused)}
            onKeyDown={onKeyboardSelect(onTogglePaused)}
          />
        ) : (
          <FiPauseCircle
            className={styles.button}
            tabIndex={0}
            role="button"
            onClick={stopPropagation(onTogglePaused)}
            onKeyDown={onKeyboardSelect(onTogglePaused)}
          />
        )}
        <FiInfo className={styles.button} tabIndex={0} />
      </Stack>
    </Columns>
  );
});
