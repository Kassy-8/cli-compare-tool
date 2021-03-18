import parseData from './parser.js';
import buildAst from './buildAst.js';
import stylish from './formatters/stylish.js';

const getDiff = (path1, path2, formatter = stylish) => {
  const object1 = parseData(path1);
  const object2 = parseData(path2);
  const diffAst = buildAst(object1, object2);
  const formatedDiff = formatter(diffAst);
  console.log(formatedDiff);
  return formatedDiff;
};

export default getDiff;
