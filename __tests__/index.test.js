import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const expectedResults = {
  stylish: fs.readFileSync(getFixturePath('resultForStylish.txt'), 'utf-8'),
  plain: fs.readFileSync(getFixturePath('resultForPlain.txt'), 'utf-8'),
};

test.each([
  ['file1.json', 'file2.json', 'stylish'],
  ['file1.yml', 'file2.yml', 'stylish'],
])('with stylish formatter', (file1, file2, formatter) => {
  const rightFile1 = getFixturePath(file1);
  const rightFile2 = getFixturePath(file2);
  expect(genDiff(rightFile1, rightFile2, formatter)).toEqual(expectedResults[formatter]);
});
// их можно объединить, но тогда не будет очевиден вывод какой форматтер сломался
test.each([
  ['file1.json', 'file2.json', 'plain'],
  ['file1.yml', 'file2.yml', 'plain'],
])('with plain formatter', (file1, file2, formatter) => {
  const rightFile1 = getFixturePath(file1);
  const rightFile2 = getFixturePath(file2);
  expect(genDiff(rightFile1, rightFile2, formatter)).toEqual(expectedResults[formatter]);
});

test.each([
  ['file1.json', 'file2.json', 'json'],
  ['file1.yml', 'file2.yml', 'json'],
])('json output format is valid', (file1, file2, formatter) => {
  const rightFile1 = getFixturePath(file1);
  const rightFile2 = getFixturePath(file2);
  expect(JSON.parse(genDiff(rightFile1, rightFile2, formatter))).toBeTruthy();
});

test('with default format', () => {
  const rightFile1 = getFixturePath('file1.json');
  const rightFile2 = getFixturePath('file2.json');
  expect(genDiff(rightFile1, rightFile2)).toEqual(expectedResults.stylish);
});
