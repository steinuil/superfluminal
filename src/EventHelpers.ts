import {
  ChangeEvent,
  Dispatch,
  BaseSyntheticEvent,
  KeyboardEventHandler,
} from 'react';

export const mapChangeEv = <T extends string>(f: Dispatch<T>) => (
  ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => f(ev.currentTarget.value as T);

export const preventDefault = <T extends BaseSyntheticEvent>(
  f?: (arg: T) => void
) => (ev: T) => {
  ev.preventDefault();
  if (f) f(ev);
};

export const stopPropagation = <T extends BaseSyntheticEvent>(
  f?: (ev: T) => void
) => (ev: T) => {
  ev.stopPropagation();
  if (f) f(ev);
};

export const onKeyboardSelect = <T = Element>(
  handler: KeyboardEventHandler<T>
): KeyboardEventHandler<T> => (ev) => {
  switch (ev.key) {
    case 'Enter':
    case ' ':
      ev.preventDefault();
      handler(ev);
  }
};
