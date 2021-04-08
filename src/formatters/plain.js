import _ from 'lodash';
import nodeTypes from '../nodeTypes.js';

const getFormattedValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const makeDiffRow = (key, type, value, newValue = null) => {
  switch (type) {
    case nodeTypes.removed:
      return `Property '${key}' was removed`;
    case nodeTypes.added:
      return `Property '${key}' was added with value: ${getFormattedValue(value)}`;
    case nodeTypes.update:
      return `Property '${key}' was updated. From ${getFormattedValue(value)} to ${getFormattedValue(newValue)}`;
    default:
      throw new Error(`unknown type of difference: ${type}`);
  }
};

const formatDiffPlain = (diffObject, path = []) => {
  const diffRows = diffObject
    .filter(({ type }) => type !== nodeTypes.unchanged)
    .map(({
      key,
      children,
      type,
      value,
      valueBefore,
      valueAfter,
    }) => {
      const currentKeyPath = [...path, key];
      const keyPathName = currentKeyPath.join('.');
      switch (type) {
        case nodeTypes.removed:
        case nodeTypes.added:
          return makeDiffRow(keyPathName, type, value);
        case nodeTypes.update:
          return makeDiffRow(keyPathName, type, valueBefore, valueAfter);
        case nodeTypes.parentNode:
          return formatDiffPlain(children, currentKeyPath);
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    })
    .join('\n');

  return diffRows;
};

export default formatDiffPlain;
