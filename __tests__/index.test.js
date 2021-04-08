import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const formats = ['stylish', 'plain'];

const expectedResults = formats.reduce((acc, format) => {
  const result = fs.readFileSync(getFixturePath(`result_${format}.txt`), 'utf-8');
  return { ...acc, [format]: result };
}, {});

const extensions = ['json', 'yml'];

test.each([
  [extensions[0], formats[0]],
  [extensions[0], formats[1]],
  [extensions[1], formats[0]],
  [extensions[1], formats[1]],
])('%s files with %s formatter', (extension, format) => {
  const file1 = getFixturePath(`file1.${extension}`);
  const file2 = getFixturePath(`file2.${extension}`);
  expect(genDiff(file1, file2, format)).toEqual(expectedResults[format]);
});

test.each([
  [extensions[0]],
  [extensions[1]],
])('json output format is valid for %s files', (extension) => {
  const file1 = getFixturePath(`file1.${extension}`);
  const file2 = getFixturePath(`file2.${extension}`);
  expect(JSON.parse(genDiff(file1, file2, 'json'))).toBeTruthy();
});

test('with default format', () => {
  const file1 = getFixturePath(`file1.${extensions[0]}`);
  const file2 = getFixturePath(`file2.${extensions[0]}`);
  expect(genDiff(file1, file2)).toEqual(expectedResults.stylish);
});
