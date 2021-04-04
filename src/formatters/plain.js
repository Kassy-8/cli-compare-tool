import _ from 'lodash';
import {
  added, removed, unchanged, update, parentNode,
} from '../buildAst.js';

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
    case removed:
      return `Property '${key}' was removed`;
    case added:
      return `Property '${key}' was added with value: ${getFormattedValue(value)}`;
    case update:
      return `Property '${key}' was updated. From ${getFormattedValue(value)} to ${getFormattedValue(newValue)}`;
    default:
      throw new Error(`unknown type of difference: ${type}`);
  }
};

const formatDiffPlain = (diffObject, path = []) => {
  const diffRows = diffObject
    .filter(({ type }) => type !== unchanged)
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
        case removed:
        case added:
          return makeDiffRow(keyPathName, type, value);
        case update:
          return makeDiffRow(keyPathName, type, valueBefore, valueAfter);
        case parentNode:
          return formatDiffPlain(children, currentKeyPath);
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    })
    .join('\n');

  return diffRows;
};

export default formatDiffPlain;
