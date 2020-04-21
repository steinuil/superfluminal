import React from 'react';
import { Stack } from '../components/Stack';
import { Columns } from '../components/Columns';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TextSingleLine } from '../components/TextSingleLine';
import { fmtBitrateBin } from '../Units';
import { State } from '../types/Store';
import { useSelector, shallowEqual } from 'react-redux';

interface Props {
  className?: string;
}

export const TopBarStats: React.FC<Props> = ({ className }) => {
  const { up, down } = useSelector<State, Record<'up' | 'down', number>>(
    ({ server }) => ({
      up: server.rate_up,
      down: server.rate_down,
    }),
    shallowEqual
  );

  return (
    <Stack spacing="4px" className={className}>
      <Columns spacing="4px">
        <FiArrowUp size="14px" />
        <TextSingleLine fontSize="14px">{fmtBitrateBin(up)}</TextSingleLine>
      </Columns>
      <Columns spacing="4px">
        <FiArrowDown size="14px" />
        <TextSingleLine fontSize="14px">{fmtBitrateBin(down)}</TextSingleLine>
      </Columns>
    </Stack>
  );
};