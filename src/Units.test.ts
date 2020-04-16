import { toFixed, fmtSecondsRemaining, fmtSizeBin, fmtSizeDec } from './Units';

describe('toFixed', () => {
  test.each([
    ['numbers without decimal parts untouched', 240, 2, '240'],
    ['exact', 1.99, 2, '1.99'],
    ['more decimal digits are truncated', 1.999, 2, '1.99'],
    ['floating point precision issues', 1.009, 5, '1.009'],
    ['less decimal digits', 1.9, 2, '1.9'],
    ['zeros', 1.09, 2, '1.09'],
    ['zeros 2', 1.009, 2, '1'],
    ['does not round up', 1.999, 2, '1.99'],
  ])('%s', (_, number, places, expected) => {
    expect(toFixed(number, places)).toBe(expected);
  });
});

describe('fmtSecondsRemaining', () => {
  test.each([
    ['returns 1 second for <1 second', 0.9, '1 second'],
    ['no s for 1 second', 1, '1 second'],
    ['<2 minutes also shows seconds', 75, '1 minute 15 seconds'],
  ])('%s', (_, secs, expected) => {
    expect(fmtSecondsRemaining(secs)).toBe(expected);
  });
});

describe('fmtSize', () => {
  test.each([
    ['0 bytes', 0, '0 bytes', '0 bytes'],
    ['1 byte', 1, '1 byte', '1 byte'],
    ['2 bytes', 2, '2 bytes', '2 bytes'],
    ['returns at most two decimal places', 2048 + 129, '2.12 KiB', '2.17 KB'],
    ['does not round up', 2047, '1.99 KiB', '2.04 KB'],
    ['bin', 2048, '2 KiB', '2.04 KB'],
    ['dec', 2000, '1.95 KiB', '2 KB'],
    ['exceedingly big', 10 * Math.pow(1024, 5), '10240 TiB', '11258.99 TB'],
  ])('%s', (_, size, expectedBin, expectedDec) => {
    expect(fmtSizeBin(size)).toBe(expectedBin);
    expect(fmtSizeDec(size)).toBe(expectedDec);
  });
});
