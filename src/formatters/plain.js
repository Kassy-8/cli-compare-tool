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
      throw new Error(`unknown type of difference: ${type}`);
  }
};

export default (diffAst) => {
  const formatDiffPlainRecursive = (diffObject, path) => {
    const diffRows = diffObject
      .filter(({ type }) => type !== 'unchanged')
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
          case 'removed':
          case 'added':
            return makeDiffRow(keyPathName, type, value);
          case 'update':
            return makeDiffRow(keyPathName, type, valueBefore, valueAfter);
          case 'parentNode':
            return formatDiffPlainRecursive(children, currentKeyPath);
          default:
            throw new Error(`unknown type of difference: ${type}`);
        }
      })
      .join('\n');

    return diffRows;
  };
  return formatDiffPlainRecursive(diffAst, []);
};
