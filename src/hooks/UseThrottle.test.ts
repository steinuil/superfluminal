import { numberToBitrate } from './UseThrottle';

test('0', () => {
  expect(numberToBitrate(0)).toEqual({
    value: 0,
    unit: 'KiB/s',
  });
});

test('1 KiB', () => {
  expect(numberToBitrate(1024)).toEqual({
    value: 1,
    unit: 'KiB/s',
  });
});

test('1 MiB', () => {
  expect(numberToBitrate(1024 * 1024)).toEqual({
    value: 1,
    unit: 'MiB/s',
  });
});

test('1 GiB', () => {
  expect(numberToBitrate(1024 * 1024 * 1024)).toEqual({
    value: 1,
    unit: 'GiB/s',
  });
});

test('1024 GiB', () => {
  expect(numberToBitrate(1024 * 1024 * 1024 * 1024)).toEqual({
    value: 1024,
    unit: 'GiB/s',
  });
});

test('0.9 GiB', () => {
  expect(numberToBitrate(1024 * 1024 * 1023)).toEqual({
    value: 1023,
    unit: 'MiB/s',
  });
});

test('1.29 GiB', () => {
  expect(numberToBitrate(1024 * 1024 * 1325)).toEqual({
    value: 1.29,
    unit: 'GiB/s',
  });
});
