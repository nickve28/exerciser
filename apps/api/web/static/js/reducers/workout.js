import {FETCH_WORKOUTS, FETCH_WORKOUT} from '../actions/index'
import _ from 'lodash'

const INITIAL_STATE = {selectedExercise: null, exercises: []}

const toCombinedModel = ({exercises, workouts}) => {
  return _.map(workouts, workout => {
    return combineExercises(workout, exercises)
  })
}

const combineExercises = (workout, exercises) => {
  const exerciseMap = _.reduce(exercises, (memo, exercise) => {
    memo[exercise.id] = exercise
    return memo
  }, {})

  const mergedExercises = _.map(workout.performed_exercises, pExercise => {
    return _.merge({}, pExercise, exerciseMap[pExercise.exercise_id])
  })
  return _.merge({}, workout, {performed_exercises: mergedExercises})
}

export default (state = INITIAL_STATE, action = {}) => {
  if (action.type === FETCH_WORKOUTS) {
    return _.merge({}, state, {workouts: toCombinedModel(action.payload)})
  }
  if (action.type === FETCH_WORKOUT) {
    return _.merge({}, state, {selectedWorkout: combineExercises(action.payload.workout, action.payload.exercises)})
  }
  return state
}