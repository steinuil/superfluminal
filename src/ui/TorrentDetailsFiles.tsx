import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { FileResource } from '../types/SynapseProtocol';
import { Stack } from '../components/Stack';
import { makeDirTree } from '../MakeDirTree';
import { DirTree } from './DirTree';
import { Button } from '../components/Button';

const useStyles = createUseStyles({});

interface Props {
  files: FileResource[];
  onValidate: () => void;
}

export const TorrentDetailsFiles: React.FC<Props> = ({ files, onValidate }) => {
  const styles = useStyles();

  const fileTree = useMemo(() => {
    return makeDirTree(files.map(({ path }) => path.split('/')));
  }, [files]);

  return (
    <Stack spacing="8px">
      <Button type="button" onClick={onValidate}>
        Validate files
      </Button>
      <DirTree tree={fileTree} />
    </Stack>
  );
};
