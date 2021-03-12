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
  console.log(`{\n${diffs}\n}`);
};

export default getDiff;
