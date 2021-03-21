import _ from 'lodash';

const diffSigns = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const filler = ' ';
const spaceCount = 2;

export default (diffAst) => {
  const formatDiffStylishRecursive = (diffObject, depth) => {
    const innerIdent = filler.repeat(spaceCount * depth);
    const lastBracerIdent = filler.repeat((spaceCount * depth) - spaceCount);

    const makeDiffRow = (key, type, value) => `${innerIdent}${diffSigns[type]} ${key}: ${value}`;

    if (_.isPlainObject(diffObject)) {
      const rows = Object.entries(diffObject)
        .map(([key, value]) => {
          const currentValue = (_.isPlainObject(value))
            ? formatDiffStylishRecursive(value, depth + 2)
            : value;
          const typeForUnchangedObject = 'unchanged';
          return makeDiffRow(key, typeForUnchangedObject, currentValue);
        });
      return [
        '{',
        ...rows,
        `${lastBracerIdent}}`,
      ].join('\n');
    }

    const diffs = diffObject
      .map(({
        key,
        value,
        type,
        valueBefore,
        valueAfter,
      }) => {
        if (type === 'update') {
          const currentValueBefore = (_.isObject(valueBefore))
            ? formatDiffStylishRecursive(valueBefore, depth + 2)
            : valueBefore;
          const currentValueAfter = (_.isObject(valueAfter, depth + 1))
            ? formatDiffStylishRecursive(valueAfter, depth + 2)
            : valueAfter;
          return `${makeDiffRow(key, 'removed', currentValueBefore)}\n${makeDiffRow(key, 'added', currentValueAfter)}`;
        }
        return (_.isObject(value))
          ? makeDiffRow(key, type, formatDiffStylishRecursive(value, depth + 2))
          : makeDiffRow(key, type, value);
      });
    return [
      '{',
      ...diffs,
      `${lastBracerIdent}}`,
    ].join('\n');
  };

  return formatDiffStylishRecursive(diffAst, 1);
};
