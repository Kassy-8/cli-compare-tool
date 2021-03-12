import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const getFileData = (pathName) => {
  const fullPath = path.resolve(process.cwd(), pathName);
  const data = fs.readFileSync(fullPath).toString();
  return data;
};

const getDiff = (path1, path2) => {
  const fileData1 = getFileData(path1);
  const fileData2 = getFileData(path2);
  const object1 = JSON.parse(fileData1);
  const object2 = JSON.parse(fileData2);
  const keys = _.union(Object.keys(object1), Object.keys(object2));
  const diffs = _.sortBy(keys)
    .reduce((acc, key) => {
    // поменять константу на переменную?
      if (!_.has(object1, key)) {
        const diffString = `  + ${key}: ${object2[key]}`;
        acc.push(diffString);
        return acc;
      }
      if (!_.has(object2, key)) {
        const diffString = `  - ${key}: ${object1[key]}`;
        acc.push(diffString);
        return acc;
      }
      if (object1[key] !== object2[key]) {
        const diffString = `  - ${key}: ${object1[key]}`;
        const diffString2 = `  + ${key}: ${object2[key]}`;
        acc.push(diffString, diffString2);
        return acc;
      }
      const diffString = `    ${key}: ${object1[key]}`;
      acc.push(diffString);
      return acc;
    }, [])
    .join('\n');
  const resultDiffString = `{\n${diffs}\n}`;
  console.log(resultDiffString);
  return resultDiffString;
};

export default getDiff;

/*
const expectedResult = `
{
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
console.log('expectedResult', expectedResult);
const string = getDiff(
  '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1.json',
'/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2.json');
console.log('getDiff', string);
console.log('is true?', string === example);
*/
