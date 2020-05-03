export const exactKeys = <T extends object>(obj: T): (keyof T)[] =>
  Object.keys(obj) as (keyof T)[];

type EntriesOf<T extends object> = Exclude<
  { [K in keyof T]: [K, T[K]] }[keyof T],
  undefined
>[];

export const exactEntries = <T extends object>(obj: T): EntriesOf<T> =>
  Object.entries(obj) as EntriesOf<T>;
