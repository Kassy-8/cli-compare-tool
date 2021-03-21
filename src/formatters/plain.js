import _ from 'lodash';

const getDisplayFormat = (displayedValue) => {
  if (_.isPlainObject(displayedValue)) {
    return '[complex value]';
  }
  if (typeof displayedValue === 'string') {
    return `'${displayedValue}'`;
  }
  return displayedValue;
};

const makeDiffRow = (key, type, value, newValue = null) => {
  switch (type) {
    case 'removed':
      return `Property '${key}' was removed`;
    case 'added':
      return `Property '${key}' was added with value: ${getDisplayFormat(value)}`;
    case 'update':
      return `Property '${key}' was updated. From ${getDisplayFormat(value)} to ${getDisplayFormat(newValue)}`;
    default:
      throw new Error('unknown type of difference');
  }
};

export default (diffAst) => {
  const formatDiffPlainRecursive = (diffObject, path) => {
    const diffRows = diffObject
      .filter(({ value, type }) => !(type === 'unchanged' && !_.isObject(value)))
      .map(({
        key,
        value,
        type,
        valueBefore,
        valueAfter,
      }) => {
        const currentKeyPath = [...path, key];
        const keyPathName = currentKeyPath.join('.');
        switch (type) {
          case 'removed':
          case 'added':
            return makeDiffRow(keyPathName, type, value);
          case 'update':
            return makeDiffRow(keyPathName, type, valueBefore, valueAfter);
          case 'unchanged':
            return formatDiffPlainRecursive(value, currentKeyPath);
          default:
            throw new Error('unknown type of difference');
        }
      })
      .join('\n');

    return diffRows;
  };
  return formatDiffPlainRecursive(diffAst, []);
};
