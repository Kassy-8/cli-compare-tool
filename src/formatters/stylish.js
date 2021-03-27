import _ from 'lodash';

const diffSigns = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  parentNode: ' ',
};

const filler = ' ';
const spaceCount = 2;

const getInnerIdent = (depth) => filler.repeat(spaceCount * depth);
const getLastBracerIdent = (depth) => filler.repeat((spaceCount * depth) - spaceCount);
const makeDiffRow = (key, type, value, depth) => `${getInnerIdent(depth)}${diffSigns[type]} ${key}: ${value}`;
const makeFinalDiffView = (rows, depth) => [
  '{',
  ...rows,
  `${getLastBracerIdent(depth)}}`,
].join('\n');

const getFormattedValue = (value, depth = 1) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const rows = Object.entries(value)
    .map(([key, currentValue]) => {
      const innerValue = getFormattedValue(currentValue, depth + 2);
      const typeForUnchangedObject = 'unchanged';
      return makeDiffRow(key, typeForUnchangedObject, innerValue, depth);
    });
  return makeFinalDiffView(rows, depth);
};

const getDiffInStylishFormat = (diffObject, depth = 1) => {
  const rows = diffObject
    .map(({
      key,
      children,
      type,
      value,
      valueBefore,
      valueAfter,
    }) => {
      switch (type) {
        case 'added':
        case 'removed':
        case 'unchanged':
          return makeDiffRow(key, type, getFormattedValue(value, depth + 2), depth);
        case 'parentNode':
          return makeDiffRow(key, type, getDiffInStylishFormat(children, depth + 2), depth);
        case 'update': {
          const currentValueBefore = getFormattedValue(valueBefore, depth + 2);
          const currentValueAfter = getFormattedValue(valueAfter, depth + 2);
          return `${makeDiffRow(key, 'removed', currentValueBefore, depth)}\n${makeDiffRow(key, 'added', currentValueAfter, depth)}`;
        }
        default:
          throw new Error(`unknown type of difference: ${type}`);
      }
    });
  return makeFinalDiffView(rows, depth);
};

export default getDiffInStylishFormat;

/*
export default (diffAst) => {
  const getDiffInStylishFormat = (diffObject, depth) => {
    const innerIdent = filler.repeat(spaceCount * depth);
    const lastBracerIdent = filler.repeat((spaceCount * depth) - spaceCount);

    const makeDiffRow = (key, type, value) => `${innerIdent}${diffSigns[type]} ${key}: ${value}`;

    if (_.isPlainObject(diffObject)) {
      const rows = Object.entries(diffObject)
        .map(([key, value]) => {
          const currentValue = (_.isPlainObject(value))
            ? getDiffInStylishFormat(value, depth + 2)
            : value;
          const typeForUnchangedObject = 'unchanged';
          return makeDiffRow(key, typeForUnchangedObject, currentValue);
        });
      return [
        '{',
        ...rows,
        `${lastBracerIdent}}`,
      ].join('\n');
    }

    const rows = diffObject
      .map(({
        key,
        children,
        type,
        value,
        valueBefore,
        valueAfter,
      }) => {
        if (type === 'parentNode') {
          return makeDiffRow(key, type, getDiffInStylishFormat(children, depth + 2));
        }
        if (type === 'update') {
          const currentValueBefore = (_.isPlainObject(valueBefore))
            ? getDiffInStylishFormat(valueBefore, depth + 2)
            : valueBefore;
          const currentValueAfter = (_.isPlainObject(valueAfter, depth + 1))
            ? getDiffInStylishFormat(valueAfter, depth + 2)
            : valueAfter;
          return `${makeDiffRow(key, 'removed', currentValueBefore)}
          !!!!!!!!\n${makeDiffRow(key, 'added', currentValueAfter)}`;
        }
        return (_.isPlainObject(value))
          ? makeDiffRow(key, type, getDiffInStylishFormat(value, depth + 2))
          : makeDiffRow(key, type, value);
      });
    return [
      '{',
      ...rows,
      `${lastBracerIdent}}`,
    ].join('\n');
  };

  return getDiffInStylishFormat(diffAst, 1);
};
*/

/*
const getDiffInStylishFormat = (diffObject, depth = 1) => {
  const rows = diffObject
    .map(({
      key,
      children,
      type,
      value,
      valueBefore,
      valueAfter,
    }) => {
      if (type === 'parentNode') {
        return makeDiffRow(key, type, getDiffInStylishFormat(children, depth + 2), depth);
      }
      if (type === 'update') {
        const currentValueBefore = getFormattedValue(valueBefore, depth + 2);
        const currentValueAfter = getFormattedValue(valueAfter, depth + 2);
        return `${makeDiffRow(key, 'removed', currentValueBefore, depth)}
        !!!!!!!!!!!\n${makeDiffRow(key, 'added', currentValueAfter, depth)}`;
      }
      return makeDiffRow(key, type, getFormattedValue(value, depth + 2), depth);
    });
  return makeFinalDiffView(rows, depth);
};
*/
