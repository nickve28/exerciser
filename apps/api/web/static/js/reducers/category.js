import {FETCH_CATEGORIES} from '../actions/index'

import _ from 'lodash'

const toKeyStore = entities => {
  return _.chain(entities)
          .map(entity => [entity.id, entity])
          .fromPairs().value()
}

export default (state = [], action) => {
  if (action.type === FETCH_CATEGORIES) {
    return toKeyStore(action.payload)
  }
  return state
}