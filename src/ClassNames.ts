export const c = (...classes: Array<string | null | undefined | false>): string =>
  classes.filter((class_) => class_ !== null && class_ !== undefined && class_ !== false).join(' ');
