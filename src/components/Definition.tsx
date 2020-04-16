import React from 'react';
import { TextSingleLine } from './TextSingleLine';
import { Stack } from './Stack';

interface Props {
  label: string;
}

export const Definition: React.FC<Props> = ({ label, children }) => (
  <Stack spacing="4px">
    <TextSingleLine bold>{label}</TextSingleLine>
    <div>{children}</div>
  </Stack>
);
