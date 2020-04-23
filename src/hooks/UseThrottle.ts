import { useState } from 'react';
import { Throttle } from '../ui/ThrottleBitrate';
import { RATES, bitrateToNumber, BitrateUnit, Bitrate } from '../Bitrate';

export const throttleToNumber = (throttle: Throttle): number | null => {
  switch (throttle.type) {
    case 'GLOBAL':
      return null;
    case 'UNLIMITED':
      return -1;
    case 'CUSTOM':
      if (throttle.bitrate.value < 0) return -1;
      if (throttle.bitrate.value === 0 || Number.isNaN(throttle.bitrate.value))
        return null;
      return bitrateToNumber(throttle.bitrate);
  }
};

const validBitrates: BitrateUnit[] = ['KiB/s', 'MiB/s', 'GiB/s'];

export const numberToBitrate = (number: number): Bitrate => {
  for (let i = validBitrates.length - 1; i > 0; i -= 1) {
    const unit = validBitrates[i];
    const value = (BigInt(number) * BigInt(100)) / BigInt(RATES[unit]);
    if (value >= BigInt(100)) {
      return { value: Number(value) / 100, unit };
    }
  }

  return {
    value: number / RATES[validBitrates[0]],
    unit: validBitrates[0],
  };
};

export const numberToThrottle = (number: number | null): Throttle => {
  switch (number) {
    case null:
      return { type: 'GLOBAL' };
    case -1:
      return { type: 'UNLIMITED' };
    default:
      return { type: 'CUSTOM', bitrate: numberToBitrate(number) };
  }
};

export const useThrottle = (initial: number | null) => {
  const [throttle, setThrottle] = useState<Throttle>(() =>
    numberToThrottle(initial)
  );
  return [throttle, setThrottle, throttleToNumber(throttle)] as const;
};
