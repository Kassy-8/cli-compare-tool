import _ from 'lodash';
import parseData from './parser.js';

const getDiff = (path1, path2) => {
  const object1 = parseData(path1);
  const object2 = parseData(path2);
  const keys = _.union(Object.keys(object1), Object.keys(object2));
  const diffSigns = ['+', '-', ' '];
  const [signOfAdd, signOfDelete, signOfNoChange] = diffSigns;
  // filler and space Count can be put into function like arguments with default values
  // and futher will used with depth-arguments for nested objects
  const filler = ' ';
  const spaceCount = 2;
  const depth = 1; // delete after function expand for nested object
  const innerIdent = filler.repeat(spaceCount * depth);
  const endBracerIdent = filler.repeat(spaceCount * (depth - 1));
  const diffs = _.sortBy(keys)
    .map((key) => {
      if (!_.has(object1, key)) {
        return `${innerIdent}${signOfAdd} ${key}: ${object2[key]}`;
      }
      if (!_.has(object2, key)) {
        return `${innerIdent}${signOfDelete} ${key}: ${object1[key]}`;
      }
      if (object1[key] !== object2[key]) {
        return `${innerIdent}${signOfDelete} ${key}: ${object1[key]}\n${innerIdent}${signOfAdd} ${key}: ${object2[key]}`;
      }
      return `${innerIdent}${signOfNoChange} ${key}: ${object1[key]}`;
    });
  const result = [
    '{',
    ...diffs,
    `${endBracerIdent}}`,
  ].join('\n');
  console.log(result);
  return result;
};

export default getDiff;
/*
const expectedResult = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const example = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const string = getDiff(
  '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1.json',
  '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2.json');
console.log('getDiff', string);
console.log('expectedResult', expectedResult);
console.log('is true?', string === expectedResult);
*/
