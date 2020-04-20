import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Columns } from '../components/Columns';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Box } from '../components/Box';
import { FiFilePlus, FiSettings, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Divider } from '../components/Divider';
import { Select } from '../components/Select';
import { onKeyboardSelect } from '../EventHelpers';
import { Stack } from '../components/Stack';
import { TextSingleLine } from '../components/TextSingleLine';
import { useSelector } from 'react-redux';
import { State } from '../types/Store';
import { fmtBitrateBin } from '../Units';

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #4f4446',
  },
  icon: {
    flexShrink: 0,
  },
  stats: {
    width: '110px',
    flexShrink: 0,
    '@media (max-width: 575.98px)': {
      display: 'none',
    },
  },
});

interface Props {
  onAddTorrent: () => void;
  onSettings: () => void;
}
export const TopBar: React.FC<Props> = ({ onAddTorrent, onSettings }) => {
  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState('All');

  const { up, down } = useSelector<State, Record<'up' | 'down', number>>(
    ({ server }) => ({
      up: server.rate_up,
      down: server.rate_down,
    })
  );

  const styles = useStyles();

  return (
    <Box padding="8px" className={styles.container}>
      <Columns spacing="8px">
        <FiFilePlus
          color="white"
          size="28px"
          className={styles.icon}
          tabIndex={0}
          onClick={onAddTorrent}
          onKeyDown={onKeyboardSelect(onAddTorrent)}
        />
        <FiSettings
          color="white"
          size="28px"
          className={styles.icon}
          tabIndex={0}
          onClick={onSettings}
          onKeyDown={onKeyboardSelect(onSettings)}
        />
        <Divider vertical />
        <Select
          value={filter}
          onChange={setFilter}
          inline
          options={[
            { value: 'All' },
            { value: 'Downloading' },
            { value: 'Seeding' },
            { value: 'Active' },
          ]}
        />
        <Divider vertical />
        <TextInput value={query} onChange={setQuery} />
        <Button type="submit" inline>
          Search
        </Button>
        <Stack spacing="4px" className={styles.stats}>
          <Columns spacing="4px">
            <FiArrowUp size="14px" />
            <TextSingleLine fontSize="14px">{fmtBitrateBin(up)}</TextSingleLine>
          </Columns>
          <Columns spacing="4px">
            <FiArrowDown size="14px" />
            <TextSingleLine fontSize="14px">
              {fmtBitrateBin(down)}
            </TextSingleLine>
          </Columns>
        </Stack>
      </Columns>
    </Box>
  );
};
