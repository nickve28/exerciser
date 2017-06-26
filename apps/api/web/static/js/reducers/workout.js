import {FETCH_WORKOUTS, FETCH_WORKOUT, FETCH_MORE_WORKOUTS, FETCH_WORKOUT_TEMPLATE} from '../actions/index'
import _ from 'lodash'

const INITIAL_STATE = {
  selectedWorkout: null,
  workouts: [],
  workoutCount: 0,
  workoutTemplate: null
}


//Converts the model to camelcase
const toWorkoutModel = (workoutData) => {
  const {description, id} = workoutData
  return {
    description, id,
    workoutDate: workoutData.workout_date,
    performedExercises: _.map(workoutData.performed_exercises, pExercise => {
      const { weight, sets, reps, metric, mode, amount, duration } = pExercise
      return {
        exerciseId: pExercise.exercise_id,
        weight, sets, reps, metric, mode, amount, duration
      }
    })
  }
}

export default (state = INITIAL_STATE, action = {}) => {
  // if (action.type === FETCH_WORKOUTS) {
  //   const workoutCount = action.payload.workout_count
  //   return _.defaults({
  //     workoutCount,
  //     workouts: _.map(action.payload.workouts, toWorkoutModel)
  //   }, INITIAL_STATE)
  // }

  // if (action.type === FETCH_WORKOUT) {
  //   return _.defaults({
  //     selectedWorkout: toWorkoutModel(action.payload)
  //   }, INITIAL_STATE)
  // }

  if (action.type === FETCH_WORKOUT_TEMPLATE) {
    return _.defaults({
      workoutTemplate: toWorkoutModel(_.first(action.payload))
    }, INITIAL_STATE)
  }

  // if (action.type === FETCH_MORE_WORKOUTS) {
  //   const workoutCount = action.payload.workout_count

  //   return _.defaults({
  //     workoutCount,
  //     workouts: _.concat(state.workouts, _.map(action.payload.workouts, toWorkoutModel))
  //   }, INITIAL_STATE)
  // }

  return state
}