import _ from 'lodash';
import parseData from './parser.js';

const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);

const buildAst = (object1, object2) => {
  const keys = _.union(Object.keys(object1), Object.keys(object2));
  console.log(keys);
  const diff = _.sortBy(keys)
    .reduce((acc, currentKey) => {
      const key = currentKey;
      let value;
      let type;
      if (!_.has(object1, key)) {
        value = object2[key];
        type = 'added';
      } else if (!_.has(object2, key)) {
        value = object1[key];
        type = 'deleted';
      } else if (object1[key] !== object2[key]) {
        value = (_.isPlainObject(object1) && _.isPlainObject(object2[key]))
          ? buildAst(object1[key], object2[key])
          : [object1[key], object2[key]];
        type = 'altered';
      } else if (object1[key] === object2[key]) {
        value = object1[key];
        type = 'unaltered';
      }
      console.log(key, value, type);
      return [
        ...acc,
        { key, value, type },
      ];
    }, []);
  return diff;
};

const example = buildAst(object11, object21);
console.log(JSON.stringify(example));
