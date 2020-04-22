import React, { useMemo, FC } from 'react';
import { createUseStyles } from 'react-jss';
import { PeerResource } from '../types/SynapseProtocol';
import { fmtProgress, fmtBitrateBin } from '../Units';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TextSingleLine } from '../components/TextSingleLine';
import { countryCodeToEmoji } from '../GetCountryByIp';

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

interface PeerProps {
  ip: string;
  availability: number;
  rateUp: number;
  rateDown: number;
  lookupIp: (ip: string) => string | null;
}

const Peer: FC<PeerProps> = ({
  ip,
  availability,
  rateUp,
  rateDown,
  lookupIp,
}) => {
  const styles = useStyles();

  const country = useMemo(() => lookupIp(ip), [ip, lookupIp]);

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{ip.split(':')[0]}</td>
      <td className={styles.cell}>{country && countryCodeToEmoji(country)}</td>
      <td className={styles.cell}>{fmtProgress(availability)}</td>
      <td className={styles.cell}>
        <div className={styles.rate}>
          <FiArrowUp className={styles.arrowIcon} /> {fmtBitrateBin(rateUp)}
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.rate}>
          <FiArrowDown className={styles.arrowIcon} /> {fmtBitrateBin(rateDown)}
        </div>
      </td>
    </tr>
  );
};

interface Props {
  peers: PeerResource[];
  lookupIp: (ip: string) => string | null;
}

export const TorrentDetailsPeers: React.FC<Props> = ({ peers, lookupIp }) => {
  const styles = useStyles();

  return peers.length > 0 ? (
    <table className={styles.table}>
      <tbody>
        {peers.map(({ id, ip, availability, rate_up, rate_down }) => (
          <Peer
            key={id}
            ip={ip}
            availability={availability}
            rateUp={rate_up}
            rateDown={rate_down}
            lookupIp={lookupIp}
          />
        ))}
      </tbody>
    </table>
  ) : (
    <TextSingleLine>No connected peers</TextSingleLine>
  );
};
