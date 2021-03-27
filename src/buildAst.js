import _ from 'lodash';

const nodeTypes = {
  added: 'added',
  removed: 'removed',
  unchanged: 'unchanged',
  update: 'update',
  parentNode: 'parentNode',
};

const buildAst = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const diff = _.sortBy(keys)
    .flatMap((key) => {
      const valueFromObject1 = object1[key];
      const valueFromObject2 = object2[key];

      if (!_.has(object1, key)) {
        const value = valueFromObject2;
        const type = nodeTypes.added;
        return { key, type, value };
      }
      if (!_.has(object2, key)) {
        const value = valueFromObject1;
        const type = nodeTypes.removed;
        return { key, type, value };
      }
      if (_.isPlainObject(valueFromObject1) && _.isPlainObject(valueFromObject2)) {
        const type = nodeTypes.parentNode;
        const children = buildAst(valueFromObject1, valueFromObject2);
        return { key, type, children };
      }
      if (valueFromObject1 !== valueFromObject2) {
        const type = nodeTypes.update;
        const valueBefore = valueFromObject1;
        const valueAfter = valueFromObject2;
        return {
          key,
          type,
          valueBefore,
          valueAfter,
        };
      }
      const value = valueFromObject1;
      const type = nodeTypes.unchanged;
      return { key, type, value };
    });
  return diff;
};

export default buildAst;
