import yaml from 'js-yaml';
import _ from 'lodash';

export default (data, format) => {
  if (_.isEmpty(data)) {
    return {};
  }
  if (format === 'json') {
    return JSON.parse(data);
  }
  if (format === ('yml' || 'yaml')) {
    return yaml.load(data);
  }
  throw new Error(`Unknown format for parsing: ${format}`);
};
