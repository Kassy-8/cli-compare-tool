import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect, beforeAll } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const expectedResults = {};
const sourceFiles = [];

beforeAll(() => {
  const stylishSample = fs.readFileSync(getFixturePath('resultForStylish.txt'), 'utf-8');
  // eslint-disable-next-line fp/no-mutation
  expectedResults.stylish = stylishSample;
  const plainSample = fs.readFileSync(getFixturePath('resultForPlain.txt'), 'utf-8');
  // eslint-disable-next-line fp/no-mutation
  expectedResults.plain = plainSample;

  const jsonFile1 = getFixturePath('file1.json');
  const jsonFile2 = getFixturePath('file2.json');
  // eslint-disable-next-line fp/no-mutation
  sourceFiles[0] = [jsonFile1, jsonFile2];
  const yamlFile1 = getFixturePath('file1.yml');
  const yamlFile2 = getFixturePath('file2.yml');
  // eslint-disable-next-line fp/no-mutation
  sourceFiles[1] = [yamlFile1, yamlFile2];
});

test.each([
  [0, 'stylish'],
  [1, 'stylish'],
  [0, 'plain'],
  [1, 'plain'],
])('with stylish formatter', (sourceIndex, formatter) => {
  const [file1, file2] = sourceFiles[sourceIndex];
  expect(genDiff(file1, file2, formatter)).toEqual(expectedResults[formatter]);
});

test.each([
  [0, 'json'],
  [1, 'json'],
])('json output format is valid', (sourceIndex, formatter) => {
  const [file1, file2] = sourceFiles[sourceIndex];
  expect(JSON.parse(genDiff(file1, file2, formatter))).toBeTruthy();
});

test('with default format', () => {
  const [file1, file2] = sourceFiles[0];
  expect(genDiff(file1, file2)).toEqual(expectedResults.stylish);
});
