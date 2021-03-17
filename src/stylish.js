import _ from 'lodash';
import parseData from './parser.js';
import buildAst from './buildAst.js';

const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);
const example = buildAst(object11, object21);

const formatDiff = (diffObject, filler = ' ', spaceCount = 2) => {
  console.log('diffObject', diffObject);
  console.log('isArray?', Array.isArray(diffObject));
  const formatDiffRecursive = (differences, depth) => {
    // console.log('differences', differences);
    // console.log('differences isArray?', Array.isArray(differences));
    const signs = {
      added: '+',
      delete: '-',
      unchnaged: ' ',
    };
    const innerIdent = filler.repeat(spaceCount * depth);
    const endBracerIdent = filler.repeat(spaceCount * (depth - 1));
    const diffs = differences
      .map(({ key, value, type = undefined, valueBefore, valueAfter }) => {
        let diffString;
        if (value !== undefined && !_.isPlainObject(value)) {
          diffString = `${innerIdent}${signs[type]} ${key}: ${value}`;
        }
        if (value !== undefined && _.isPlainObject(value)) {
          diffString = `${innerIdent}${signs[type]} ${key}: ${formatDiffRecursive(value)}`;
        }
        if (type === 'changed') {
          const currentValueBefore = (_.isPlainObject(valueBefore))
            ? formatDiffRecursive(valueBefore)
            : valueBefore;
          const currentValueAfter = (_.isPlainObject(valueAfter))
            ? formatDiffRecursive(valueAfter)
            : valueAfter;
          diffString = `${innerIdent}${signs[type]} ${key}: ${currentValueBefore}\n${innerIdent}${signs[type]} ${key}: ${currentValueAfter}`;
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

  return formatDiffRecursive(diffObject, 1);
};

const test = formatDiff(example);
console.log(test);
/*
map не работает, потому что когда в вэлью один ребенок
я добилась чтобы это был не массив, а объект. А с объектом рекурсивно функция не срабатывает
мэп ждет массива. Т.о. надо в билд аст вернуть массив даже в случае единичного объекта
*/
