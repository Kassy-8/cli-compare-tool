import _ from 'lodash';
// import parseData from './parser.js';
// import buildAst from './buildAst.js';
/*
const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);
const example = buildAst(object11, object21);
*/
const stylish = (differences, filler = ' ', spaceCount = 2) => {
  const formatDiffRecursive = (diffObject, depth) => {
    const signs = {
      added: '+',
      deleted: '-',
      unchanged: ' ',
    };
    const innerIdent = filler.repeat(spaceCount * depth);
    const endBracerIdent = filler.repeat((spaceCount * depth) - spaceCount);

    if (_.isPlainObject(diffObject)) {
      const rows = Object.entries(diffObject)
        .map(([key, value]) => {
          const currentValue = (_.isPlainObject(value))
            ? formatDiffRecursive(value, depth + 2)
            : value;
          return `${innerIdent}${signs.unchanged} ${key}: ${currentValue}`;
        });
      const resultForObject = [
        '{',
        ...rows,
        `${endBracerIdent}}`,
      ].join('\n');
      return resultForObject;
    }

    const diffs = diffObject
      .flatMap(({ key, value, type, valueBefore, valueAfter }) => {
        let diffString;
        if (type === 'changed') {
          const currentValueBefore = (_.isObject(valueBefore))
            ? formatDiffRecursive(valueBefore, depth + 2)
            : valueBefore;
          const currentValueAfter = (_.isObject(valueAfter, depth + 1))
            ? formatDiffRecursive(valueAfter, depth + 2)
            : valueAfter;
          diffString = `${innerIdent}${signs.deleted} ${key}: ${currentValueBefore}\n${innerIdent}${signs.added} ${key}: ${currentValueAfter}`;
        } else if (!_.isObject(value)) {
          diffString = `${innerIdent}${signs[type]} ${key}: ${value}`;
        } else if (_.isObject(value)) {
          diffString = `${innerIdent}${signs[type]} ${key}: ${formatDiffRecursive(value, depth + 2)}`;
        }
        return diffString;
      });
    const result = [
      '{',
      ...diffs,
      `${endBracerIdent}}`,
    ].join('\n');
    return result;
  };

  return formatDiffRecursive(differences, 1);
};

export default stylish;
/*
const test = formatDiff(example);
console.log(test);
*/
