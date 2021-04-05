import _ from 'lodash';
import {
  added, removed, unchanged, update, parentNode,
} from '../buildAst.js';

const diffSigns = {
  [added]: '+',
  [removed]: '-',
  [unchanged]: ' ',
  [parentNode]: ' ',
};

const ident = '  ';
const identsCount = 2;

const makeInnerIdent = (depth) => {
  if (depth === 0) {
    return ident;
  }
  return `${ident}${ident.repeat(identsCount * depth)}`;
};

const makeLastBraceIdent = (depth) => {
  if (depth === 0) {
    return '';
  }
  return ident.repeat(identsCount * depth);
};

const makeDiffRow = (key, value, diffSign, depth) => {
  const innerIdent = makeInnerIdent(depth);
  return `${innerIdent}${diffSign} ${key}: ${value}`;
};

const formatNestedObject = (rows, depth) => {
  const lastBracerIdent = makeLastBraceIdent(depth);
  return [
    '{',
    ...rows,
    `${lastBracerIdent}}`,
  ].join('\n');
};

const formatValue = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const rows = Object.entries(value)
    .map(([key, currentValue]) => {
      const innerValue = formatValue(currentValue, depth + 1);
      return makeDiffRow(key, innerValue, diffSigns[unchanged], depth);
    });
  return formatNestedObject(rows, depth);
};

const formatDiffStylish = (diffObject, depth = 0) => {
  const rows = diffObject
    .map(({
      key,
      children,
      type,
      value,
      valueBefore,
      valueAfter,
    }) => {
      const diffSign = diffSigns[type];
      switch (type) {
        case added:
        case removed:
        case unchanged: {
          return makeDiffRow(key, formatValue(value, depth + 1), diffSign, depth);
        }
        case parentNode: {
          return makeDiffRow(key, formatDiffStylish(children, depth + 1), diffSign, depth);
        }
        case update: {
          const currentValueBefore = formatValue(valueBefore, depth + 1);
          const currentValueAfter = formatValue(valueAfter, depth + 1);
          const rowBefore = makeDiffRow(key, currentValueBefore, diffSigns[removed], depth);
          const rowAfter = makeDiffRow(key, currentValueAfter, diffSigns[added], depth);
          return `${rowBefore}\n${rowAfter}`;
        }
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    });
  return formatNestedObject(rows, depth);
};

export default formatDiffStylish;
