import React, { useState } from 'react';
import { mapChangeEv } from '../EventHelpers';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    // backgroundColor: '#393939',
    // borderBottom: '2px solid #202020',
    borderBottom: '1px solid #4f4446',
    padding: '8px',
  },
});

interface Props {}

export const TopBar: React.FC<Props> = () => {
  const [query, setQuery] = useState('');

  const styles = useStyles();

  return (
    <div className={styles.container}>
      <input type="text" value={query} onChange={mapChangeEv(setQuery)} />
      <button type="submit">Search</button>
    </div>
  );
};
