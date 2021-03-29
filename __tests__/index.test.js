import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const stylishSample = fs.readFileSync(getFixturePath('resultForStylish.txt'), 'utf-8');
const plainSample = fs.readFileSync(getFixturePath('resultForPlain.txt'), 'utf-8');

const expectedResults = {
  stylish: stylishSample,
  plain: plainSample,
};

test.each([
  ['file1.json', 'file2.json', 'stylish'],
  ['file1.yml', 'file2.yml', 'stylish'],
  ['file1.json', 'file2.json', 'plain'],
  ['file1.yml', 'file2.yml', 'plain'],
])('with different formatters', (file1, file2, formatter) => {
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
/*
// beforeAll убрано из импортов, чтобы линтер не ругался

const expectedResults = {
  stylish: '',
  plain: '',
};

const sourceFiles = [];

beforeAll(() => {
  const stylishSample = fs.readFileSync(getFixturePath('resultForStylish.txt'), 'utf-8');
  expectedResults.stylish = stylishSample;
  const plainSample = fs.readFileSync(getFixturePath('resultForPlain.txt'), 'utf-8');
  expectedResults.plain = plainSample;

  const jsonFile1 = getFixturePath('file1.json');
  const jsonFile2 = getFixturePath('file2.json');
  sourceFiles[0] = [jsonFile1, jsonFile2];
  const yamlFile1 = getFixturePath('file1.yml');
  const yamlFile2 = getFixturePath('file2.yml');
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
*/
