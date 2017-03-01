import _ from 'lodash'

import {FETCH_EXERCISES} from '../actions/index'

const INITIAL_STATE = {
  exercises: [],
  count: 0
}

const toKeyStore = entities => {
  return _.chain(entities)
          .map(entity => [entity.id, entity])
          .fromPairs().value()
}

export default (state = INITIAL_STATE, action = {}) => {
  if (action.type === FETCH_EXERCISES) {
    return {
      exercises: toKeyStore(action.payload.exercises),
      count: action.payload.exerciseCount
    }
  }
  return state
}