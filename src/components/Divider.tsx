import React from 'react';
import { createUseStyles } from 'react-jss';

interface Props {
  vertical?: boolean;
}

const useStyles = createUseStyles({
  divider: (props: Props) => ({
    backgroundColor: '#4f4446',
    ...(props.vertical
      ? {
          width: '1px',
          alignSelf: 'stretch',
          flexShrink: 0,
        }
      : {
          height: '1px',
          width: '100%',
        }),
  }),
});

export const Divider: React.FC<Props> = ({ vertical }) => {
  const styles = useStyles({ vertical });

  return <div className={styles.divider} />;
};
