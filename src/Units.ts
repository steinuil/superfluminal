// Because Number.prototype.toFixed rounds up and I don't want that.
// Note: I've already tried to make this the Right Way(tm) and it didn't
// work out because of float precision.
export const toFixed = (n: number, places: number) =>
  n
    .toString()
    .replace(new RegExp(`(\\.\\d{${places}})\\d*$`), '$1')
    .replace(/(\.[1-9]*)0+$/, '$1')
    .replace(/\.$/, '');

interface Clamp {
  min: number;
  max: number;
}

export const clamp = (n: number, { min, max }: Clamp) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export const fmtProgress = (progress: number) =>
  `${toFixed(progress * 100, 2)}%`;

interface Remaining {
  size: number;
  transferredDown: number;
  rateDown: number;
}

const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

const s = (n: number, unit: string) =>
  n < 1 ? '' : n < 2 ? `1 ${unit}` : `${Math.ceil(n)} ${unit}s`;

export const fmtSecondsRemaining = (secs: number) => {
  if (secs < 1) {
    return '1 second';
  }
  if (secs < ONE_MINUTE) {
    return s(secs, 'second');
  }
  if (secs < ONE_MINUTE * 2) {
    return `1 minute ${s(secs % ONE_MINUTE, 'second')}`.trimRight();
  }
  if (secs < ONE_HOUR) {
    return s(secs / ONE_MINUTE, 'minute');
  }
  if (secs < ONE_HOUR * 2) {
    return `1 hour ${s((secs % ONE_HOUR) / ONE_MINUTE, 'minute')}`.trimRight();
  }
  if (secs < ONE_DAY) {
    return s(secs / ONE_HOUR, 'hour');
  }
  if (secs < ONE_DAY * 2) {
    return `1 day ${s((secs % ONE_DAY) / ONE_HOUR, 'hour')}`.trimRight();
  }
  return s(secs / ONE_DAY, 'day');
};

export const fmtRemaining = ({ size, transferredDown, rateDown }: Remaining) =>
  fmtSecondsRemaining((size - transferredDown) / rateDown);

interface FmtSize {
  sizes: string[];
  orderOf: (n: number) => number;
  scale: (order: number) => number;
}

const fmtSize = ({ sizes, orderOf, scale }: FmtSize) => (size: number) => {
  if (size < 1) return '0 bytes';
  if (size < 2) return '1 byte';
  const order = clamp(Math.floor(orderOf(size)), {
    min: 0,
    max: sizes.length - 1,
  });
  const scaled = size / scale(order);
  return `${toFixed(scaled, 2)} ${sizes[order]}`;
};

const SIZES_BIN = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

const SIZES_DEC = ['bytes', 'KB', 'MB', 'GB', 'TB'];

export const fmtSizeBin = fmtSize({
  sizes: SIZES_BIN,
  orderOf: (n: number) => Math.log2(n) / 10,
  scale: (order) => Math.pow(1024, order),
});

export const fmtSizeDec = fmtSize({
  sizes: SIZES_DEC,
  orderOf: (n: number) => Math.log10(n) / 3,
  scale: (order) => Math.pow(1000, order),
});

export const fmtBitrateBin = (bitrate: number) => `${fmtSizeBin(bitrate)}/s`;

export const fmtBitrateDec = (bitrate: number) => `${fmtSizeDec(bitrate)}/s`;

export const fmtRatio = (ratio: number) =>
  isFinite(ratio) ? toFixed(ratio, 2) : '∞';
