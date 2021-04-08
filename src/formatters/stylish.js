import _ from 'lodash';
import nodeTypes from '../nodeTypes.js';

const diffSigns = {
  [nodeTypes.added]: '+',
  [nodeTypes.removed]: '-',
  [nodeTypes.unchanged]: ' ',
  [nodeTypes.parentNode]: ' ',
};

const ident = '  ';
const identsCount = 2;

const makeInnerIdent = (depth) => `${ident}${ident.repeat(identsCount * depth)}`;

const makeLastBraceIdent = (depth) => ident.repeat(identsCount * depth);

const makeDiffRow = (key, value, type, depth) => {
  const innerIdent = makeInnerIdent(depth);
  return `${innerIdent}${diffSigns[type]} ${key}: ${value}`;
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
      return makeDiffRow(key, innerValue, nodeTypes.unchanged, depth);
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
      switch (type) {
        case nodeTypes.added:
        case nodeTypes.removed:
        case nodeTypes.unchanged: {
          return makeDiffRow(key, formatValue(value, depth + 1), type, depth);
        }
        case nodeTypes.parentNode: {
          return makeDiffRow(key, formatDiffStylish(children, depth + 1), type, depth);
        }
        case nodeTypes.update: {
          const currentValueBefore = formatValue(valueBefore, depth + 1);
          const currentValueAfter = formatValue(valueAfter, depth + 1);
          const rowBefore = makeDiffRow(key, currentValueBefore, nodeTypes.removed, depth);
          const rowAfter = makeDiffRow(key, currentValueAfter, nodeTypes.added, depth);
          return `${rowBefore}\n${rowAfter}`;
        }
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    });
  return formatNestedObject(rows, depth);
};

export default formatDiffStylish;
