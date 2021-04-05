import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect, beforeAll } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const sourceFiles = [
  ['file1.json', 'file2.json'],
  ['file1.yml', 'file2.yml'],
];
const [jsonFiles, yamlFiles] = sourceFiles;

const formatters = {
  stylish: 'stylish',
  plain: 'plain',
  json: 'json',
};
const { stylish, plain, json } = formatters;

const cases = [
  [jsonFiles, stylish],
  [yamlFiles, stylish],
  [jsonFiles, plain],
  [yamlFiles, plain],
  [jsonFiles, json],
  [yamlFiles, json],
];

const expectedResults = {};

beforeAll(() => {
  const stylishSample = fs.readFileSync(getFixturePath('resultForStylish.txt'), 'utf-8');
  // eslint-disable-next-line fp/no-mutation
  expectedResults.stylish = stylishSample;
  const plainSample = fs.readFileSync(getFixturePath('resultForPlain.txt'), 'utf-8');
  // eslint-disable-next-line fp/no-mutation
  expectedResults.plain = plainSample;
});

test.each([0, 1, 2, 3])('with stylish and plain formatters', (caseIndex) => {
  const [files, formatter] = cases[caseIndex];
  const file1 = getFixturePath(files[0]);
  const file2 = getFixturePath(files[1]);
  expect(genDiff(file1, file2, formatter)).toEqual(expectedResults[formatter]);
});

test.each([4, 5])('json output format is valid', (caseIndex) => {
  const [files, formatter] = cases[caseIndex];
  const file1 = getFixturePath(files[0]);
  const file2 = getFixturePath(files[1]);
  expect(JSON.parse(genDiff(file1, file2, formatter))).toBeTruthy();
});

test('with default format', () => {
  const files = sourceFiles[0];
  const file1 = getFixturePath(files[0]);
  const file2 = getFixturePath(files[1]);
  expect(genDiff(file1, file2)).toEqual(expectedResults.stylish);
});
