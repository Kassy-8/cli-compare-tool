import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (diffObject, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return stylish(diffObject);
    case 'plain':
      return plain(diffObject);
    case 'json':
      return json(diffObject);
    default:
      throw new Error(`unknown output format: ${outputFormat}`);
  }
};
