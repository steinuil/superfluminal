import React from 'react';
import { Stack } from '../components/Stack';
import { TextField } from '../components/TextField';
import { Throttle, ThrottleBitrate } from './ThrottleBitrate';
import { SelectField } from '../components/SelectField';
import { Button } from '../components/Button';
import { TorrentStrategy } from '../types/SynapseProtocol';

interface Props {
  path: string;
  setPath: (p: string) => void;
  pathModified?: boolean;
  priority: 1 | 2 | 3 | 4 | 5;
  setPriority: (p: 1 | 2 | 3 | 4 | 5) => void;
  priorityModified?: boolean;
  downloadStrategy: TorrentStrategy;
  setDownloadStrategy: (s: TorrentStrategy) => void;
  strategyModified?: boolean;
  downloadThrottle: Throttle;
  setDownloadThrottle: (t: Throttle) => void;
  downloadThrottleModified?: boolean;
  uploadThrottle: Throttle;
  setUploadThrottle: (t: Throttle) => void;
  uploadThrottleModified?: boolean;
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export const TorrentDetailsOptions: React.FC<Props> = ({
  path,
  setPath,
  pathModified,
  priority,
  setPriority,
  priorityModified,
  downloadStrategy,
  setDownloadStrategy,
  strategyModified,
  downloadThrottle,
  setDownloadThrottle,
  downloadThrottleModified,
  uploadThrottle,
  setUploadThrottle,
  uploadThrottleModified,
  onSubmit,
  submitDisabled,
}) => (
  <Stack spacing="16px">
    <TextField
      label="Path"
      type="text"
      value={path}
      onChange={setPath}
      modified={pathModified}
    />
    <SelectField
      label="Priority"
      value={priority.toString()}
      onChange={(p) => setPriority(parseInt(p, 10) as 1 | 2 | 3 | 4 | 5)}
      modified={priorityModified}
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
      modified={strategyModified}
      options={[
        { value: 'rarest', name: 'Rarest' },
        { value: 'sequential', name: 'Sequential' },
      ]}
    />
    <ThrottleBitrate
      title="Download throttle"
      throttle={downloadThrottle}
      onChange={setDownloadThrottle}
      modified={downloadThrottleModified}
    />
    <ThrottleBitrate
      title="Upload throttle"
      throttle={uploadThrottle}
      onChange={setUploadThrottle}
      modified={uploadThrottleModified}
    />
    <Button onClick={onSubmit} type="submit" disabled={submitDisabled}>
      Update settings
    </Button>
  </Stack>
);
