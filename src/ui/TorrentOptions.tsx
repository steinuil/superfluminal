import * as React from 'react';
import { FC, SetStateAction, useState } from 'react';
import { FormGroup, Input, Card, Label } from 'reactstrap';
import { mapChangeEv } from '../EventHelpers';
import { ThrottleBitrate, Throttle } from './ThrottleBitrate';
import { useId } from '../hooks/UseId';

interface Props {
  startImmediately: boolean;
  setStartImmediately: (b: SetStateAction<boolean>) => void;
  hasImport: boolean;
  shouldImport: boolean;
  setShouldImport: (b: SetStateAction<boolean>) => void;
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

export const TorrentOptions: FC<Props> = ({
  startImmediately,
  setStartImmediately,
  hasImport,
  shouldImport,
  setShouldImport,
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
}) => {
  const pathId = useId('path', []);
  const priorityId = useId('priority', []);
  const strategyId = useId('strategy', []);

  return (
    <Card body className="pb-0">
      <FormGroup>
        <Label htmlFor={pathId}>Path</Label>
        <Input
          id={pathId}
          type="text"
          placeholder="Path"
          value={path}
          onChange={mapChangeEv(setPath)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor={priorityId}>Priority</Label>
        <Input
          id={priorityId}
          type="select"
          value={priority.toString()}
          onChange={mapChangeEv((p) =>
            setPriority(parseInt(p, 10) as 1 | 2 | 3 | 4 | 5)
          )}
        >
          <option value="1">Lowest</option>
          <option value="2">Low</option>
          <option value="3">Normal</option>
          <option value="4">High</option>
          <option value="5">Highest</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label htmlFor={strategyId}>Download strategy</Label>
        <Input
          id={strategyId}
          type="select"
          value={downloadStrategy}
          onChange={mapChangeEv(setDownloadStrategy)}
        >
          <option value="rarest">Rarest</option>
          <option value="sequential">Sequential</option>
        </Input>
      </FormGroup>
      <FormGroup check className="mb-3">
        <Label>
          <Input
            type="checkbox"
            checked={startImmediately}
            onChange={() => setStartImmediately((p) => !p)}
          />
          Start immediately
        </Label>
      </FormGroup>
      {hasImport && (
        <FormGroup check className="mb-3">
          <Label>
            <Input
              type="checkbox"
              checked={shouldImport}
              onChange={() => setShouldImport((p) => !p)}
            />
            Import (skip hash check)
          </Label>
        </FormGroup>
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
    </Card>
  );
};
