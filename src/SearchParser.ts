import {
  float,
  string,
  Parjser,
  anyCharOf,
  lower,
  anyStringOf,
  spaces1,
  noCharOf,
  upper,
  whitespace,
} from 'parjs';
import {
  or,
  many,
  map,
  manySepBy,
  between,
  then,
  stringify,
  mustCapture,
  recover,
  qthen,
} from 'parjs/combinators';
import { CriterionOp, Criterion } from './types/SynapseProtocol';

const symbolOperation = anyStringOf(
  '==',
  '!=',
  '>',
  '<',
  '>=',
  '<='
) as Parjser<CriterionOp>;

const wordOperation = anyStringOf(
  'like',
  'ilike',
  'in',
  '!in',
  'has',
  '!has'
) as Parjser<CriterionOp>;

const operation = wordOperation.pipe(
  between(spaces1()),
  recover<CriterionOp>(() => ({ kind: 'Soft' })),
  or(symbolOperation.pipe(between(whitespace())))
);

const normalField = lower().pipe(or('_'), many(), stringify());

const userDataField = string('user_data/').pipe(
  then(normalField.pipe(manySepBy('/'))),
  map(([first, rest]) => first + rest.join('/'))
);

export const field = userDataField.pipe(or(normalField));

const escaped = string('\\').pipe(qthen(anyCharOf('\\"')));

const quotedString = escaped.pipe(
  or(noCharOf('"')),
  many(),
  stringify(),
  between('"')
);

const freeString = lower().pipe(
  or(upper(), anyCharOf('_-.')),
  many(),
  stringify(),
  mustCapture()
);

export const value = float().pipe(or(quotedString, freeString));

export const criterion: Parjser<Criterion> = field.pipe(
  then(operation, value),
  map(([field, op, value]) => ({ field, op, value }))
);

export const criteria = criterion.pipe(
  manySepBy(string(';').pipe(between(whitespace())))
);
