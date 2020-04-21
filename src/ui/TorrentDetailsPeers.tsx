import React from 'react';
import { createUseStyles } from 'react-jss';
import { PeerResource } from '../types/SynapseProtocol';
import { fmtProgress, fmtBitrateBin } from '../Units';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TextSingleLine } from '../components/TextSingleLine';

const useStyles = createUseStyles({
  table: {
    width: '100%',
  },
  row: {
    fontSize: '13px',
  },
  cell: {
    padding: '0 2px',
  },
  rate: {
    display: 'flex',
    alignItems: 'center',
  },
  arrowIcon: {
    marginRight: '2px',
    marginTop: '2px',
  },
});

interface Props {
  peers: PeerResource[];
}

export const TorrentDetailsPeers: React.FC<Props> = ({ peers }) => {
  const styles = useStyles();

  return peers.length > 0 ? (
    <table className={styles.table}>
      <tbody>
        {peers.map(({ id, ip, availability, rate_up, rate_down }) => (
          <tr key={id} className={styles.row}>
            <td className={styles.cell}>{ip}</td>
            <td className={styles.cell}>{fmtProgress(availability)}</td>
            <td className={styles.cell}>
              <div className={styles.rate}>
                <FiArrowUp className={styles.arrowIcon} />{' '}
                {fmtBitrateBin(rate_up)}
              </div>
            </td>
            <td className={styles.cell}>
              <div className={styles.rate}>
                <FiArrowDown className={styles.arrowIcon} />{' '}
                {fmtBitrateBin(rate_down)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <TextSingleLine>No connected peers</TextSingleLine>
  );
};
