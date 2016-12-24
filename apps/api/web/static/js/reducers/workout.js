import {FETCH_WORKOUTS} from '../actions/index'
import _ from 'lodash'

const toCombinedModel = ({exercises, workouts}) => {
  const exerciseMap = _.reduce(exercises, (memo, exercise) => {
    memo[exercise.id] = exercise
    return memo
  }, {})

  return _.map(workouts, workout => {
    const mergedExercises = _.map(workout.performed_exercises, pExercise => {
      return _.merge({}, pExercise, exerciseMap[pExercise.exercise_id])
    })
    return _.merge({}, workout, {performed_exercises: mergedExercises})
  })
}

export default (state = [], action = {}) => {
  if (action.type === FETCH_WORKOUTS) {
    return toCombinedModel(action.payload)
  }
  return state
}