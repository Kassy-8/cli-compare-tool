import _ from 'lodash';

const diffSigns = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  parentNode: ' ',
};

const filler = ' ';
const spaceCount = 2;

const makeDiffRow = (key, value, diffSign, depth) => {
  const innerIdent = filler.repeat(spaceCount * depth);
  return `${innerIdent}${diffSign} ${key}: ${value}`;
};

const makeFinalViewForObject = (rows, depth) => {
  const lastBracerIdent = filler.repeat((spaceCount * depth) - spaceCount);
  return [
    '{',
    ...rows,
    `${lastBracerIdent}}`,
  ].join('\n');
};

const getFormattedValue = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const rows = Object.entries(value)
    .map(([key, currentValue]) => {
      const innerValue = getFormattedValue(currentValue, depth + 2);
      return makeDiffRow(key, innerValue, diffSigns.unchanged, depth);
    });
  return makeFinalViewForObject(rows, depth);
};

const getDiffInStylishFormat = (diffObject, depth = 1) => {
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
        case 'added':
        case 'removed':
        case 'unchanged': {
          return makeDiffRow(key, getFormattedValue(value, depth + 2), diffSign, depth);
        }
        case 'parentNode': {
          return makeDiffRow(key, getDiffInStylishFormat(children, depth + 2), diffSign, depth);
        }
        case 'update': {
          const currentValueBefore = getFormattedValue(valueBefore, depth + 2);
          const currentValueAfter = getFormattedValue(valueAfter, depth + 2);
          return `${makeDiffRow(key, currentValueBefore, diffSigns.removed, depth)}\n${makeDiffRow(key, currentValueAfter, diffSigns.added, depth)}`;
        }
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    });
  return makeFinalViewForObject(rows, depth);
};

export default getDiffInStylishFormat;
