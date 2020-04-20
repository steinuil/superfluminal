import React from 'react';
import { StatusBar } from './StatusBar';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';

interface Props {}

interface Selected {
  torrentCount: number;
  rateUp: number;
  rateDown: number;
}

export const ConnectedStatusBar: React.FC<Props> = () => {
  const { torrentCount, rateUp, rateDown } = useSelector<State, Selected>(
    (s) => ({
      torrentCount: Object.keys(s.torrents).length,
      rateDown: s.server.rate_down,
      rateUp: s.server.rate_up,
    })
  );

  if (rateDown === undefined) return null;

  return (
    <StatusBar
      rateDown={rateDown}
      rateUp={rateUp}
      torrentCount={torrentCount}
    />
  );
};
