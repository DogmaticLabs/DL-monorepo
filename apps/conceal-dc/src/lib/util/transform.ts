import _ from 'lodash'

export const camelCaseKeys = (obj: object) =>
  _.transform(obj, (acc: any, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key)

    acc[camelKey] = _.isObject(value) ? camelCaseKeys(value) : value
  })
