import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import getDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// посмотреть еще раз как строятся пути через функции,
// можно ли сократить передачу в тесты до расширения
const expectedResultStylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

const expectedResultPlainFormat = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;
/*
const exampleForJson = [{"key":"common","value":
[{"key":"follow","value":false,"type":"added"},
{"key":"setting1","value":"Value 1","type":"unchanged"},
{"key":"setting2","value":200,"type":"removed"},
{"key":"setting3","valueBefore":true,"valueAfter":null,"type":"update"},
{"key":"setting4","value":"blah blah","type":"added"},
{"key":"setting5","value":{"key5":"value5"},"type":"added"},
{"key":"setting6","value":[{"key":"doge","value":
[{"key":"wow","valueBefore":"","valueAfter":"so much","type":"update"}],"type":"unchanged"},
{"key":"key","value":"value","type":"unchanged"},
{"key":"ops","value":"vops","type":"added"}],"type":"unchanged"}],"type":"unchanged"},
{"key":"group1","value":[{"key":"baz","valueBefore":"bas","valueAfter":"bars","type":"update"},
{"key":"foo","value":"bar","type":"unchanged"},{"key":"nest","valueBefore":{"key":"value"},
"valueAfter":"str","type":"update"}],"type":"unchanged"},
{"key":"group2","value":{"abc":12345,"deep":{"id":45}},"type":"removed"},
{"key":"group3","value":{"deep":{"id":{"number":45}},"fee":100500},"type":"added"}];
const expectedResultJSONFormat = JSON.stringify(exampleForJson);
*/
test('test nested json files with stylish format', () => {
  expect(getDiff(getFixturePath('file1Nested.json'), getFixturePath('file2Nested.json'), 'stylish')).toEqual(expectedResultStylish);
});
test('test nested yaml files stylish format', () => {
  expect(getDiff(getFixturePath('file1Nested.yaml'), getFixturePath('file2Nested.yaml'))).toEqual(expectedResultStylish);
});
test('test json files with plain format', () => {
  expect(getDiff(getFixturePath('file1Nested.json'), getFixturePath('file2Nested.json'), 'plain')).toEqual(expectedResultPlainFormat);
});
test('test yaml files with plain format', () => {
  expect(getDiff(getFixturePath('file1Nested.yaml'), getFixturePath('file2Nested.yaml'), 'plain')).toEqual(expectedResultPlainFormat);
});
/*
test('test json files with json format', () => {
  expect(getDiff(getFixturePath('file1Nested.json'),
  getFixturePath('file2Nested.json'), 'json')).toEqual(expectedResultJSONFormat);
});
test('test yaml files with json format', () => {
  expect(getDiff(getFixturePath('file1Nested.yaml'),
  getFixturePath('file2Nested.yaml'), 'json')).toEqual(expectedResultJSONFormat);
});
*/
test('test with json.parse', () => {
  expect(JSON.parse(getDiff(getFixturePath('file1Nested.yaml'), getFixturePath('file2Nested.yaml'), 'json'))).toBeTruthy();
});
