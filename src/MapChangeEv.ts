import { ChangeEvent, Dispatch } from 'react';

export const mapChangeEv = <T extends string>(f: Dispatch<T>) => (
  ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => f(ev.currentTarget.value as T);
