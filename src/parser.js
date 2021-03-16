import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// need to take out reading files function to another module, must be only parser
export default (pathName) => {
  const fullPath = path.resolve(process.cwd(), pathName);
  const data = fs.readFileSync(fullPath).toString();
  const format = path.extname(pathName);
  if (format === '.json') {
    return JSON.parse(data);
  }
  if (format === '.yaml') {
    return yaml.load(data);
  }
  throw new Error('Unknown format, can\'t parse file');
};
