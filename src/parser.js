import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

export default (fileData, pathName) => {
  if (_.isEmpty(fileData)) {
    return {};
  }
  const format = path.extname(pathName);
  if (format === '.json') {
    return JSON.parse(fileData);
  }
  if (format === ('.yaml' || '.yml')) {
    return yaml.load(fileData);
  }
  throw new Error('Unknown format for parsing');
};
