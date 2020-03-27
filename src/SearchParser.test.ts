import { Parjser } from 'parjs';
import { criterion, field, value, criteria } from './SearchParser';

const parse = <T>(parser: Parjser<T>, input: string): T =>
  parser.parse(input).value;

test('criterion with number value', () => {
  expect(parse(criterion, 'test == 1')).toEqual({
    field: 'test',
    op: '==',
    value: 1,
  });
});

test('criterion with no spaces around symbol operator', () => {
  expect(parse(criterion, 'test==1')).toEqual({
    field: 'test',
    op: '==',
    value: 1,
  });
});

test('criterion with word operator', () => {
  expect(parse(criterion, 'test like 1')).toEqual({
    field: 'test',
    op: 'like',
    value: 1,
  });
});

test('word operators must be separated by space', () => {
  expect(() => parse(criterion, 'testlike1')).toThrow();
});

test('only user_data fields can use json pointer syntax', () => {
  expect(() => parse(field, 'test/one')).toThrow();
});

test('user_data field', () => {
  expect(parse(field, 'user_data/ayy/lmao')).toBe('user_data/ayy/lmao');
});

test('user_data field in criterion', () => {
  expect(parse(criterion, 'user_data/ayy/lmao == one')).toEqual({
    field: 'user_data/ayy/lmao',
    op: '==',
    value: 'one',
  });
});

test('number value', () => {
  expect(parse(value, '123.123')).toBe(123.123);
});

test('quoted string', () => {
  expect(parse(value, `"test quoted string"`)).toBe('test quoted string');
});

test('escaped chars inside quoted string', () => {
  expect(parse(value, `"test \\" escaped string \\\\ ayy"`)).toBe(
    'test " escaped string \\ ayy'
  );
});

test('many criteria', () => {
  expect(
    parse(criteria, `criterion == 1 ; criteria!=2;no_spaces !in "sierra leone"`)
  ).toEqual([
    { field: 'criterion', op: '==', value: 1 },
    { field: 'criteria', op: '!=', value: 2 },
    { field: 'no_spaces', op: '!in', value: 'sierra leone' },
  ]);
});
