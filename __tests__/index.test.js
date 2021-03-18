import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import getDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const expectedResultForNestedObject = `{
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

test('test nested json files', () => {
  expect(getDiff(getFixturePath('file1Nested.json'), getFixturePath('file2Nested.json'))).toEqual(expectedResultForNestedObject);
});
test('test nested yaml files', () => {
  expect(getDiff(getFixturePath('file1Nested.yaml'), getFixturePath('file2Nested.yaml'))).toEqual(expectedResultForNestedObject);
});
