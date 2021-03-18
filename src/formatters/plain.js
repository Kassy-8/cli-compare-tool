import _ from 'lodash';

const formatDiff = (differences) => {
  const formatDiffRecursive = (diffObject, path) => {
    const diffLines = diffObject
      .filter(({ value, type }) => !(type === 'unchanged' && !_.isObject(value)))
      .map({ })
  }
  return formatDiffRecursive(differences, '');
}