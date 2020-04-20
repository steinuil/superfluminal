import React from 'react';
import { Stack } from '../components/Stack';
import { Definition } from '../components/Definition';
import { fmtSizeBin } from '../Units';

interface Props {
  name: string | null;
  size: number | null;
  isPrivate: boolean;
  comment: string | null;
  creationDate: Date | null;
  createdBy: string | null;
}

export const TorrentInfo: React.FC<Props> = ({
  name,
  size,
  isPrivate,
  comment,
  creationDate,
  createdBy,
}) => (
  <Stack spacing="8px">
    <Definition label="Name">{name !== null ? name : '[unknown]'}</Definition>
    <Definition label="Size">
      {size !== null ? fmtSizeBin(size) : '[unknown]'}
    </Definition>
    <Definition label="Type">{isPrivate ? 'Private' : 'Public'}</Definition>
    {comment && <Definition label="Comment">{comment}</Definition>}
    {creationDate && (
      <Definition label="Created at">
        {creationDate.toLocaleString()}
      </Definition>
    )}
    {createdBy && <Definition label="Created by">{createdBy}</Definition>}
  </Stack>
);
