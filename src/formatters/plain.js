import _ from 'lodash';
// import parseData from '../parser.js';
// import buildAst from '../buildAst.js';
/*
const tree = [
  {"key":"common","value":
    [
      {"key":"follow","value":false,"type":"added"},
      {"key":"setting1","value":"Value 1","type":"unchanged"},
      {"key":"setting2","value":200,"type":"removed"},
      {"key":"setting3","valueBefore":true,"valueAfter":null,"type":"update"},
      {"key":"setting4","value":"blah blah","type":"added"},
      {"key":"setting5","value":
        {"key5":"value5"},
      "type":"added"},
      {"key":"setting6","value":
        [
          {"key":"doge","value":
            [
              {"key":"wow","valueBefore":"","valueAfter":"so much","type":"update"}
            ],
            "type":"unchanged"},
          {"key":"key","value":"value","type":"unchanged"},
          {"key":"ops","value":"vops","type":"added"}
        ],
        "type":"unchanged"}
    ],
    "type":"unchanged"},
  {"key":"group1","value":
    [
      {"key":"baz","valueBefore":"bas","valueAfter":"bars","type":"update"},
      {"key":"foo","value":"bar","type":"unchanged"},
      {"key":"nest","valueBefore":
        {"key":"value"},
      "valueAfter":"str","type":"update"}
    ],
    "type":"unchanged"},
  {"key":"group2","value":
    {"abc":12345,"deep":
      {"id":45}
    },
    "type":"removed"},
  {"key":"group3","value":
    {"deep":
      {"id":
        {"number":45}
      },
    "fee":100500},
  "type":"added"}
];
*/

const makeDiffLine = (key, type, value, newValue = null) => {
  const makeDisplayedValue = (currentValue) => {
    if (_.isPlainObject(currentValue)) {
      return '[complex value]';
    }
    if (typeof currentValue === 'string') {
      return `'${currentValue}'`;
    }
    return currentValue;
  };

  switch (type) {
    case 'removed':
      return `Property '${key}' was removed`;
    case 'added':
      return `Property '${key}' was added with value: ${makeDisplayedValue(value)}`;
    case 'update':
      return `Property '${key}' was updated. From ${makeDisplayedValue(value)} to ${makeDisplayedValue(newValue)}`;
    default:
      throw new Error('unknown type of difference');
  }
};

export default (diff) => {
  const formatDiffRecursive = (diffObject, path) => {
    const diffLines = diffObject
      .filter(({ value, type }) => !(type === 'unchanged' && !_.isObject(value)))
      .map(({ key, value, type, valueBefore, valueAfter }) => {
        const currentKeyPath = [...path, key];
        const keyPathName = currentKeyPath.join('.');
        // switch?
        if (type === 'removed') {
          return makeDiffLine(keyPathName, type, value);
        }
        if (type === 'added') {
          return makeDiffLine(keyPathName, type, value);
        }
        if (type === 'update') {
          return makeDiffLine(keyPathName, type, valueBefore, valueAfter);
        }
        if (type === 'unchanged') {
          return formatDiffRecursive(value, currentKeyPath);
        }
        throw new Error('unknown type of difference');
      })
      .join('\n');

    return diffLines;
  };
  return formatDiffRecursive(diff, []);
};

/*
const path1 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file1Nested.json';
const path2 = '/home/catherine/Hexlet-projects/frontend-project-lvl2/__fixtures__/file2Nested.json';
const object11 = parseData(path1);
const object21 = parseData(path2);
const example = buildAst(object11, object21);

const test = formatDiff(example);
console.log(test);
*/
