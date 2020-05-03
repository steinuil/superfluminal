import React from 'react';
import { createUseStyles } from 'react-jss';
import { toFixed } from '../Units';
import { TorrentStatus } from '../types/SynapseProtocol';

interface StyleProps {
  done: string;
  availability: string;
  status: TorrentStatus;
}

const useStyles = createUseStyles({
  container: {
    height: '14px',
    width: '100%',
    backgroundColor: '#EEE',
    position: 'relative',
  },
  availability: {
    backgroundColor: '#CCC',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: (props: StyleProps) => `${props.availability}%`,
  },
  progress: {
    backgroundColor: (props: StyleProps) =>
      props.status === 'paused' ? '#797979' : '#40c9db',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: (props: StyleProps) => `${props.done}%`,
  },
  shadow: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    left: '0',
    height: '7px',
    backgroundColor: 'black',
    opacity: 0.1,
  },
  border: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    border: '1px solid rgba(0, 0, 0, 0.25)',
  },
});

interface Props {
  availability: number;
  progress: number;
  status: TorrentStatus;
}

export const ProgressBar: React.FC<Props> = ({
  availability,
  progress,
  status,
}) => {
  const styles = useStyles({
    availability: toFixed(availability * 100, 2),
    done: toFixed(progress * 100, 2),
    status,
  });

  return (
    <div className={styles.container}>
      <div className={styles.availability} />
      <div className={styles.progress} />
      <div className={styles.shadow} />
      <div className={styles.border} />
    </div>
  );
};
