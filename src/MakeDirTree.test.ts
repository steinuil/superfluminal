import { makeDirTree } from './MakeDirTree';

test('no subdirectories', () => {
  expect(makeDirTree([['plain.txt'], ['files.txt']])).toEqual([
    'files.txt',
    'plain.txt',
  ]);
});

test('entries are sorted', () => {
  expect(makeDirTree([['a'], ['c'], ['b'], ['e'], ['d']])).toEqual([
    'a',
    'b',
    'c',
    'd',
    'e',
  ]);
});

test('file in subdirectory', () => {
  expect(
    makeDirTree([['dir', 'subdir', 'file.txt'], ['file_out.txt']])
  ).toEqual([['dir', [['subdir', ['file.txt']]]], 'file_out.txt']);
});

test('group by folder', () => {
  expect(
    makeDirTree([
      ['dir', 'subdir', 'file1.txt'],
      ['dir', 'subdir', 'file2.txt'],
      ['dir', 'subdir2', 'file3.txt'],
      ['dir', 'file4.txt'],
      ['file5.txt'],
    ])
  ).toEqual([
    [
      'dir',
      [
        ['subdir', ['file1.txt', 'file2.txt']],
        ['subdir2', ['file3.txt']],
        'file4.txt',
      ],
    ],
    'file5.txt',
  ]);
});

// https://stackoverflow.com/questions/21320256/is-there-a-way-to-make-constructor-a-valid-key-in-a-js-object
test('"constructor" as dir in path', () => {
  expect(() => {
    makeDirTree([
      ['constructor', 'constructor', 'constructor'],
      ['constructor', 'constructor', 'test'],
      ['constructor', 'test'],
      ['test'],
    ]);
  }).not.toThrow();
});
