export type BitrateUnit = 'B/s' | 'KiB/s' | 'MiB/s' | 'GiB/s' | 'TiB/s';

export interface Bitrate {
  value: number;
  unit: BitrateUnit;
}

const rates: { [U in BitrateUnit]: number } = {
  'B/s': Math.pow(1024, 0),
  'KiB/s': Math.pow(1024, 1),
  'MiB/s': Math.pow(1024, 2),
  'GiB/s': Math.pow(1024, 3),
  'TiB/s': Math.pow(1024, 4),
};

export function convertToBitrate(value: number, unit: BitrateUnit) {
  return value * rates[unit];
}

export function convertFromBitrate(value: number, unit: BitrateUnit) {
  return value / rates[unit];
}

export const bitrateToNumber = ({ value, unit }: Bitrate) =>
  value * rates[unit];

export function convertedRate(bitrate: number): [number, BitrateUnit] {
  if (bitrate > rates['TiB/s']) {
    return [bitrate / rates['TiB/s'], 'TiB/s'];
  } else if (bitrate > rates['GiB/s']) {
    return [bitrate / rates['GiB/s'], 'GiB/s'];
  } else if (bitrate > rates['MiB/s']) {
    return [bitrate / rates['MiB/s'], 'MiB/s'];
  } else if (bitrate > rates['KiB/s']) {
    return [bitrate / rates['KiB/s'], 'KiB/s'];
  } else {
    return [bitrate, 'B/s'];
  }
}

function places(n: number) {
  let places = 2;
  if (n >= 100) {
    places = 0;
  } else if (n >= 10) {
    places = 1;
  }
  if (n.toFixed(places) === (0).toFixed(places)) {
    places = 0;
  }
  return places;
}

export function formatBitrate(bitrate: number) {
  const [rate, unit] = convertedRate(bitrate);
  return `${rate.toFixed(places(rate))} ${unit}`;
}

export function formatAmount(amount: number) {
  const units: { [U in BitrateUnit]: string } = {
    'TiB/s': 'TiB',
    'GiB/s': 'GiB',
    'MiB/s': 'MiB',
    'KiB/s': 'KiB',
    'B/s': 'bytes',
  };
  const [rate, unit] = convertedRate(amount);
  return `${rate.toFixed(places(rate))} ${units[unit]}`;
}
