import * as React from 'react';
import { FC } from 'react';
import { ThrottleBitrate, Throttle } from './ThrottleBitrate';
import { Stack } from '../components/Stack';
import { TextField } from '../components/TextField';
import { CheckboxField } from '../components/CheckboxField';
import { SelectField } from '../components/SelectField';

interface Props {
  startImmediately: boolean;
  toggleStartImmediately: () => void;
  hasImport: boolean;
  shouldImport: boolean;
  toggleShouldImport: () => void;
  path: string;
  setPath: (p: string) => void;
  priority: 1 | 2 | 3 | 4 | 5;
  setPriority: (p: 1 | 2 | 3 | 4 | 5) => void;
  downloadStrategy: string;
  setDownloadStrategy: (s: string) => void;
  downloadThrottle: Throttle;
  setDownloadThrottle: (t: Throttle) => void;
  uploadThrottle: Throttle;
  setUploadThrottle: (t: Throttle) => void;
}

export const AddTorrentOptions: FC<Props> = ({
  startImmediately,
  toggleStartImmediately,
  hasImport,
  shouldImport,
  toggleShouldImport,
  path,
  setPath,
  priority,
  setPriority,
  downloadStrategy,
  setDownloadStrategy,
  downloadThrottle,
  setDownloadThrottle,
  uploadThrottle,
  setUploadThrottle,
}) => (
  <Stack spacing="16px">
    <TextField label="Path" type="text" value={path} onChange={setPath} />
    <SelectField
      label="Priority"
      value={priority.toString()}
      onChange={(p) => setPriority(parseInt(p, 10) as 1 | 2 | 3 | 4 | 5)}
      options={[
        { value: '1', name: 'Lowest' },
        { value: '2', name: 'Low' },
        { value: '3', name: 'Normal' },
        { value: '4', name: 'High' },
        { value: '5', name: 'Highest' },
      ]}
    />
    <SelectField
      label="Download strategy"
      value={downloadStrategy}
      onChange={setDownloadStrategy}
      options={[
        { value: 'rarest', name: 'Rarest' },
        { value: 'sequential', name: 'Sequential' },
      ]}
    />
    <CheckboxField
      label="Start immediately"
      checked={startImmediately}
      onChange={toggleStartImmediately}
    />
    {hasImport && (
      <CheckboxField
        label="Import (skip hash check)"
        checked={shouldImport}
        onChange={toggleShouldImport}
      />
    )}
    <ThrottleBitrate
      title="Download throttle"
      throttle={downloadThrottle}
      onChange={setDownloadThrottle}
    />
    <ThrottleBitrate
      title="Upload throttle"
      throttle={uploadThrottle}
      onChange={setUploadThrottle}
    />
  </Stack>
);
