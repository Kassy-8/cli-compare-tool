import parseData from './parser.js';
import buildAst from './buildAst.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';

const getFormattedDiff = (diffObject, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return stylish(diffObject);
    case 'plain':
      return plain(diffObject);
    default:
      throw new Error('unknown output format');
  }
};

const getDiff = (path1, path2, formatName = 'stylish') => {
  const object1 = parseData(path1);
  const object2 = parseData(path2);
  const diffAst = buildAst(object1, object2);
  const formatedDiff = getFormattedDiff(diffAst, formatName);
  console.log(formatedDiff);
  return formatedDiff;
};

export default getDiff;
