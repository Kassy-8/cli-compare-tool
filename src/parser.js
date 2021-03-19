import path from 'path';
import yaml from 'js-yaml';

// need to take out reading files function to another module, must be only parser
export default (fileData, pathName) => {
  const format = path.extname(pathName);
  if (format === '.json') {
    return JSON.parse(fileData);
  }
  if (format === '.yaml') {
    return yaml.load(fileData);
  }
  throw new Error('Unknown format, can\'t parse file');
};
