import React, { ReactNode } from 'react';
import { TextSingleLine } from './TextSingleLine';
import { Stack } from './Stack';
import { LongText } from './LongText';

interface Props {
  label: string;
  children: ReactNode;
}

export const Definition = ({ label, children }: Props) => (
  <Stack spacing="4px">
    <TextSingleLine bold>{label}</TextSingleLine>
    <LongText>{children}</LongText>
  </Stack>
);
