import { ChangeEvent, Dispatch, BaseSyntheticEvent } from 'react';

export const mapChangeEv = <T extends string>(f: Dispatch<T>) => (
  ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => f(ev.currentTarget.value as T);

export const preventDefault = <T extends BaseSyntheticEvent>(
  f?: (arg: T) => void
) => (ev: T) => {
  ev.preventDefault();
  if (f) f(ev);
};
