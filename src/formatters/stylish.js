import _ from 'lodash';

const diffSigns = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const filler = ' ';
const spaceCount = 2;

export default (diffAst) => {
  const formatDiffRecursive = (diffObject, depth) => {
    const innerIdent = filler.repeat(spaceCount * depth);
    const lastBracerIdent = filler.repeat((spaceCount * depth) - spaceCount);

    const makeDiffRow = (key, type, value) => `${innerIdent}${diffSigns[type]} ${key}: ${value}`;

    if (_.isPlainObject(diffObject)) {
      const rows = Object.entries(diffObject)
        .map(([key, value]) => {
          const currentValue = (_.isPlainObject(value))
            ? formatDiffRecursive(value, depth + 2)
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
      .map(({ key, value, type, valueBefore, valueAfter }) => {
        let diffRow;
        if (type === 'update') {
          const currentValueBefore = (_.isObject(valueBefore))
            ? formatDiffRecursive(valueBefore, depth + 2)
            : valueBefore;
          const currentValueAfter = (_.isObject(valueAfter, depth + 1))
            ? formatDiffRecursive(valueAfter, depth + 2)
            : valueAfter;
          diffRow = `${makeDiffRow(key, 'removed', currentValueBefore)}\n${makeDiffRow(key, 'added', currentValueAfter)}`;
        } else if (!_.isObject(value)) {
          diffRow = makeDiffRow(key, type, value);
        } else if (_.isObject(value)) {
          diffRow = makeDiffRow(key, type, formatDiffRecursive(value, depth + 2));
        }
        return diffRow;
      });
    return [
      '{',
      ...diffs,
      `${lastBracerIdent}}`,
    ].join('\n');
  };

  return formatDiffRecursive(diffAst, 1);
};
