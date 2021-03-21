import _ from 'lodash';

const diffSigns = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  parentNode: ' ',
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

    const rows = diffObject
      .map(({
        key,
        children,
        type,
        value,
        valueBefore,
        valueAfter,
      }) => {
        if (type === 'parentNode') {
          return makeDiffRow(key, type, formatDiffStylishRecursive(children, depth + 2));
        }
        if (type === 'update') {
          const currentValueBefore = (_.isPlainObject(valueBefore))
            ? formatDiffStylishRecursive(valueBefore, depth + 2)
            : valueBefore;
          const currentValueAfter = (_.isPlainObject(valueAfter, depth + 1))
            ? formatDiffStylishRecursive(valueAfter, depth + 2)
            : valueAfter;
          return `${makeDiffRow(key, 'removed', currentValueBefore)}\n${makeDiffRow(key, 'added', currentValueAfter)}`;
        }
        return (_.isPlainObject(value))
          ? makeDiffRow(key, type, formatDiffStylishRecursive(value, depth + 2))
          : makeDiffRow(key, type, value);
      });
    return [
      '{',
      ...rows,
      `${lastBracerIdent}}`,
    ].join('\n');
  };

  return formatDiffStylishRecursive(diffAst, 1);
};
