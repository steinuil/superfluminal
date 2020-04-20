import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { FileResource } from '../types/SynapseProtocol';
import { Stack } from '../components/Stack';
import { makeDirTree } from '../MakeDirTree';
import { DirTree } from './DirTree';

const useStyles = createUseStyles({});

interface Props {
  files: FileResource[];
}

export const TorrentDetailsFiles: React.FC<Props> = ({ files }) => {
  const styles = useStyles();

  const fileTree = useMemo(() => {
    return makeDirTree(files.map(({ path }) => path.split('/')));
  }, [files]);

  return (
    <Stack spacing="4px">
      <DirTree tree={fileTree} />
    </Stack>
  );
};
