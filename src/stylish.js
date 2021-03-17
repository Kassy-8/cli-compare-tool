import _ from 'lodash';
import parseData from './parser.js';
import buildAst from './buildAst.js';

const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);
const example = buildAst(object11, object21);

const formatDiff = (diffObject, filler = ' ', spaceCount = 2) => {
  const formatDiffIter = (differences, depth) => {
    // const diffSigns = ['+', '-', ' '];
    // const [signOfAdd, signOfDelete, signOfUnchanged] = diffSigns;
    const signs = {
      added: '+',
      delete: '-',
      unchnaged: ' ',
    }
    const innerIdent = filler.repeat(spaceCount * depth);
    const endBracerIdent = filler.repeat(spaceCount * (depth - 1));
    const diffs = differences
      .map(({ key, value, type, valueBefore, valueAfter }) => {
        if (_.isPlainObject(value)) {
          return `${innerIdent}${signs[type]} ${key}: ${formatDiffIter(value, depth + 1)}`;
        }
        if (type === 'changed') {

        }
        return `${innerIdent}${signs[type]} ${key}: ${}`;
          return `${innerIdent}${signOfAdd} ${key}: ${value}`;
        }
          return `${innerIdent}${signOfDelete} ${key}: ${value}`;

          return `${innerIdent}${signOfDelete} ${key}: ${object1[key]}\n${innerIdent}${signOfAdd} ${key}: ${object2[key]}`;

        return `${innerIdent}${signOfUnchanged} ${key}: ${object1[key]}`;
      });
    const result = [
      '{',
      ...diffs,
      `${endBracerIdent}}`,
    ].join('\n');
  };

  return formatDiffIter(diffObject, 1);
};