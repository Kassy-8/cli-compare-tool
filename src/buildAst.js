import _ from 'lodash';
import parseData from './parser.js';

const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);

const buildAst = (object1, object2) => {
  const keys = _.union(Object.keys(object1), Object.keys(object2));
  const diff = _.sortBy(keys)
    .map((key) => {
      const currentValue1 = object1[key];
      const currentValue2 = object2[key];
      let value;
      let type;
      if (!_.has(object1, key)) {
        value = currentValue2;
        type = 'added';
      } else if (!_.has(object2, key)) {
        value = currentValue1;
        type = 'deleted';
      } else if (currentValue1 === currentValue2) {
        value = currentValue1;
        type = 'unchanged';
      } else if (currentValue1 !== currentValue2) {
        type = 'changed';
        if (_.isPlainObject(currentValue1) && _.isPlainObject(currentValue2)) {
          value = buildAst(currentValue1, currentValue2);
        } else {
          const valueBefore = currentValue1;
          const valueAfter = currentValue2;
          return {
            key,
            valueBefore,
            valueAfter,
            type,
          };
        }
      }
      return { key, value, type };
    });
  return diff;
};

export default buildAst;

const example = buildAst(object11, object21);
console.log(Array.isArray(example));
