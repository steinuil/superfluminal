import React, { Fragment } from 'react';
import { createUseStyles } from 'react-jss';
import { DirTree as Tree } from '../MakeDirTree';
import { LongText } from './LongText';

const useStyles = createUseStyles({
  ul: {
    paddingLeft: '20px',
  },
  li: {},
});

interface Props {
  tree: Tree[];
  depth?: number;
}

export const DirTree: React.FC<Props> = ({ tree, depth = 0 }) => {
  const styles = useStyles();

  return (
    <ul className={styles.ul}>
      {tree.map((path) =>
        typeof path === 'string' ? (
          <li key={path} className={styles.li}>
            <LongText>{path}</LongText>
          </li>
        ) : (
          <Fragment key={path[0]}>
            <li className={styles.li}>
              <LongText>{path[0]}/</LongText>
            </li>
            {depth < 1 && <DirTree tree={path[1]} depth={depth + 1} />}
          </Fragment>
        )
      )}
    </ul>
  );
};
