import _ from 'lodash';

const buildAst = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const diff = _.sortBy(keys)
    .map((key) => {
      const valueFromObject1 = object1[key];
      const valueFromObject2 = object2[key];
      let value;
      let type;

      if (!_.has(object1, key)) {
        value = valueFromObject2;
        type = 'added';
      } else if (!_.has(object2, key)) {
        value = valueFromObject1;
        type = 'removed';
      } else if (valueFromObject1 === valueFromObject2) {
        value = valueFromObject1;
        type = 'unchanged';
      } else if (valueFromObject1 !== valueFromObject2) {
        if (_.isPlainObject(valueFromObject1) && _.isPlainObject(valueFromObject2)) {
          type = 'unchanged';
          value = buildAst(valueFromObject1, valueFromObject2);
        } else {
          type = 'update';
          const valueBefore = valueFromObject1;
          const valueAfter = valueFromObject2;
          return {
            key,
            valueBefore,
            valueAfter,
            type,
          };
        }
      }
      return { key, value, type };
    });
  return diff;
};

export default buildAst;
