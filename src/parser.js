import yaml from 'js-yaml';
import _ from 'lodash';

export default (fileData, format) => {
  if (_.isEmpty(fileData)) {
    return {};
  }
  if (format === '.json') {
    return JSON.parse(fileData);
  }
  if (format === ('.yml' || '.yaml')) {
    return yaml.load(fileData);
  }
  throw new Error(`Unknown format for parsing: ${format}`);
};
