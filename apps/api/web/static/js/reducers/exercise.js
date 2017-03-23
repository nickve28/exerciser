import _ from 'lodash'

import {FETCH_EXERCISES, FETCH_EXERCISE, UPDATE_EXERCISE} from '../actions/index'

const INITIAL_STATE = {
  exercises: {},
  exerciseOrder: [],
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
      exerciseOrder: _.map(action.payload.exercises, 'id'),
      count: action.payload.exerciseCount
    }
  }
  if (action.type === FETCH_EXERCISE) {
    const currentExercises = _.clone(state.exercises)
    currentExercises[action.payload.id] = action.payload
    return {
      exercises: currentExercises,
      exerciseOrder: state.exerciseOrder || [action.payload.id],
      count: action.payload.exerciseCount
    }
  }
  if (action.type === UPDATE_EXERCISE) {
    const exercise = action.payload.update_exercise

    const {id} = exercise
    const newStore = _.defaults({[id]: exercise}, state.exercises)

    return {count: state.count, exercises: newStore}
  }
  return state
}