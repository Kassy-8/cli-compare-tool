import path from 'path';
import fs from 'fs';
import parseData from './parser.js';
import buildAst from './buildAst.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import json from './formatters/json.js';

const readFile = (pathName) => {
  const fullPath = path.resolve(process.cwd(), pathName);
  const data = fs.readFileSync(fullPath).toString();
  return data;
};

const getFormattedDiff = (diffObject, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return stylish(diffObject);
    case 'plain':
      return plain(diffObject);
    case 'json':
      return json(diffObject);
    default:
      throw new Error('unknown output format');
  }
};

export default (path1, path2, formatName = 'stylish') => {
  const data1 = readFile(path1);
  const data2 = readFile(path2);
  const object1 = parseData(data1, path1);
  const object2 = parseData(data2, path2);
  const diffAst = buildAst(object1, object2);
  const formatedDiff = getFormattedDiff(diffAst, formatName);
  return formatedDiff;
};
