import React, { useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { DirTree as Tree } from '../MakeDirTree';
import { FiFile, FiPlus, FiMinus } from 'react-icons/fi';
import { c } from '../ClassNames';
import { onKeyboardSelect } from '../EventHelpers';

const useStyles = createUseStyles({
  ul: {
    listStyle: 'none',
  },
  ul2: {
    paddingLeft: '10px',
  },
  li: {
    fontSize: '14px',
    wordBreak: 'break-word',
    display: 'flex',
    '&:hover': {
      backgroundColor: '#444',
      cursor: 'pointer',
    },
  },
  icon: {
    flexShrink: 0,
    marginRight: '4px',
    marginTop: '4px',
    marginLeft: '2px',
  },
});

// DirTree and DirTreeItem are mutually recursive.

interface ItemProps {
  path: Tree;
  open: Set<string>;
  toggle: (subTree: string) => void;
  depth: number;
}

export const DirTreeItem: React.FC<ItemProps> = ({
  path,
  open,
  toggle,
  depth,
}) => {
  const styles = useStyles();

  const onClick = useCallback(() => toggle(path[0]), [toggle, path[0]]);

  if (typeof path === 'string') {
    return (
      <li key={path} className={styles.li}>
        <FiFile className={styles.icon} size="16px" /> <div>{path}</div>
      </li>
    );
  }

  const isOpen = open.has(path[0]);

  return (
    <li>
      <div
        className={styles.li}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyboardSelect(onClick)}
      >
        {React.createElement(isOpen ? FiMinus : FiPlus, {
          className: styles.icon,
          size: '16px',
        })}
        <div>{path[0]}/</div>
      </div>
      {isOpen && <DirTree tree={path[1]} depth={depth + 1} />}
    </li>
  );
};

interface Props {
  tree: Tree[];
  depth?: number;
}

export const DirTree: React.FC<Props> = ({ tree, depth = 0 }) => {
  const styles = useStyles();

  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (i: string) => {
      const newState = new Set(open);

      if (open.has(i)) {
        newState.delete(i);
      } else {
        newState.add(i);
      }

      setOpen(newState);
    },
    [open]
  );

  return (
    <ul className={c(styles.ul, depth > 0 && styles.ul2)}>
      {tree.map((path) => (
        <DirTreeItem
          key={typeof path === 'string' ? path : path[0]}
          depth={depth}
          open={open}
          path={path}
          toggle={toggle}
        />
      ))}
    </ul>
  );
};
