import React from 'react';
import { Stack } from '../components/Stack';
import { Columns } from '../components/Columns';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TextSingleLine } from '../components/TextSingleLine';
import { fmtBitrateBin } from '../Units';
import { State } from '../types/Store';
import { useSelector } from 'react-redux';

interface Props {
  className?: string;
}

export const TopBarStats: React.FC<Props> = ({ className }) => {
  const up = useSelector<State, number>(({ server }) => server.rate_up);
  const down = useSelector<State, number>(({ server }) => server.rate_down);

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
