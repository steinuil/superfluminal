import React from 'react';
import { Stack } from '../components/Stack';
import { TextField } from '../components/TextField';
import { Throttle, ThrottleBitrate } from './ThrottleBitrate';
import { SelectField } from '../components/SelectField';
import { Button } from '../components/Button';

interface Props {
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

export const TorrentDetailsOptions: React.FC<Props> = ({
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
    <Button type="submit">Update settings</Button>
  </Stack>
);
