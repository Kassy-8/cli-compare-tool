import path from 'path';
import fs from 'fs';
import parseData from './parser.js';
import buildAst from './buildAst.js';
import formatDiff from './formatters/index.js';

const readFile = (pathName) => {
  const fullPath = path.resolve(process.cwd(), pathName);
  const data = fs.readFileSync(fullPath).toString();
  return data;
};

export default (path1, path2, formatName = 'stylish') => {
  const data1 = readFile(path1);
  const data2 = readFile(path2);
  const format1 = path.extname(path1).substring(1);
  const format2 = path.extname(path2).substring(1);
  const object1 = parseData(data1, format1);
  const object2 = parseData(data2, format2);
  const diffAst = buildAst(object1, object2);
  const formatedDiff = formatDiff(diffAst, formatName);
  return formatedDiff;
};
