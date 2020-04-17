import React from 'react';
import { Bitrate, BitrateUnit, bitrateToNumber } from '../Bitrate';
import { Radio } from '../components/Radio';
import { Stack } from '../components/Stack';
import { TextInput } from '../components/TextInput';
import { Select } from '../components/Select';
import { TextSingleLine } from '../components/TextSingleLine';
import { Columns } from '../components/Columns';

const initialBitrate: Bitrate = {
  value: 0,
  unit: 'KiB/s',
};

interface CustomProps {
  bitrate: Bitrate;
  onChange: (br: Bitrate) => void;
}

const ThrottleCustom: React.FC<CustomProps> = ({ bitrate, onChange }) => {
  const onChangeValue = (value: string) => {
    const n = parseInt(value, 10);
    if (isNaN(n)) onChange({ value: 0, unit: bitrate.unit });

    onChange({ value: n, unit: bitrate.unit });
  };

  const onChangeUnit = (unit: BitrateUnit) =>
    onChange({ value: bitrate.value, unit });

  return (
    <Columns spacing="8px">
      <TextInput
        type="number"
        value={bitrate.value.toString()}
        onChange={onChangeValue}
      />
      <Select<BitrateUnit>
        value={bitrate.unit}
        onChange={onChangeUnit}
        options={[{ value: 'KiB/s' }, { value: 'MiB/s' }, { value: 'GiB/s' }]}
        inline
      />
    </Columns>
  );
};

export type Throttle =
  | { type: 'GLOBAL' }
  | { type: 'UNLIMITED' }
  | { type: 'CUSTOM'; bitrate: Bitrate };

export const throttleToNumber = (throttle: Throttle): number | null => {
  switch (throttle.type) {
    case 'GLOBAL':
      return null;
    case 'UNLIMITED':
      return -1;
    case 'CUSTOM':
      return bitrateToNumber(throttle.bitrate);
  }
};

interface Props {
  title: string;
  throttle: Throttle;
  onChange: (newThrottle: Throttle) => void;
}

export const ThrottleBitrate: React.FC<Props> = ({
  title,
  throttle,
  onChange,
}) => (
  <Stack spacing="8px">
    <TextSingleLine bold>{title}</TextSingleLine>
    <Radio
      label="Global"
      checked={throttle.type === 'GLOBAL'}
      onChange={() => onChange({ type: 'GLOBAL' })}
    />
    <Radio
      label="Unlimited"
      checked={throttle.type === 'UNLIMITED'}
      onChange={() => onChange({ type: 'UNLIMITED' })}
    />
    <Radio
      label="Custom"
      checked={throttle.type === 'CUSTOM'}
      onChange={() => onChange({ type: 'CUSTOM', bitrate: initialBitrate })}
    />
    {throttle.type === 'CUSTOM' && (
      <ThrottleCustom
        bitrate={throttle.bitrate}
        onChange={(bitrate) => onChange({ type: 'CUSTOM', bitrate })}
      />
    )}
  </Stack>
);
