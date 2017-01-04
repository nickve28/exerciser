import {FETCH_WORKOUTS, FETCH_WORKOUT, FETCH_MORE_WORKOUTS} from '../actions/index'
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
    return _.defaults({workouts: toCombinedModel(action.payload)}, state)
  }
  if (action.type === FETCH_WORKOUT) {
    return _.defaults({selectedWorkout: combineExercises(action.payload.workout, action.payload.exercises)}, state)
  }
  if (action.type === FETCH_MORE_WORKOUTS) {
    return _.merge({}, state,  {workouts: _.concat(state.workouts, toCombinedModel(action.payload))})
  }
  return state
}