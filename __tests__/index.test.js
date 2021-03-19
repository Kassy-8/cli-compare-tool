import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, beforeAll } from '@jest/globals';
import getDiff from '../src/index.js';

let jsonFile1;
let jsonFile2;
let yamlFile1;
let yamlFile2;

beforeAll(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  jsonFile1 = getFixturePath('file1.json');
  jsonFile2 = getFixturePath('file2.json');
  yamlFile1 = getFixturePath('file1.yaml');
  yamlFile2 = getFixturePath('file2.yaml');
});

const resultForStylishFormat = `{
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

const resultPlainFormat = `Property 'common.follow' was added with value: false
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

test('json files with stylish format', () => {
  expect(getDiff(jsonFile1, jsonFile2, 'stylish')).toEqual(resultForStylishFormat);
});
test('yaml files stylish format', () => {
  expect(getDiff(yamlFile1, yamlFile2, 'stylish')).toEqual(resultForStylishFormat);
});
test('json files with plain format', () => {
  expect(getDiff(jsonFile1, jsonFile2, 'plain')).toEqual(resultPlainFormat);
});
test('yaml files with plain format', () => {
  expect(getDiff(yamlFile1, yamlFile2, 'plain')).toEqual(resultPlainFormat);
});

test('json files json output format is valid', () => {
  expect(JSON.parse(getDiff(jsonFile1, jsonFile2, 'json'))).toBeTruthy();
});
test('json output format is valid', () => {
  expect(JSON.parse(getDiff(yamlFile1, yamlFile2, 'json'))).toBeTruthy();
});
