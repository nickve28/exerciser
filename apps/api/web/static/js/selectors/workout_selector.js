import { createSelector } from 'reselect'

import _ from 'lodash'

const exerciseSelector = state => state.exercises.exercises
const workoutSelector =  state => state.workouts.selectedWorkout

const toViewModel = (exercises, workout) => {
  return combineExercises(workout, exercises)
}

const combineExercises = (workout, exercises) => {
  const dataNotLoaded = _.isEmpty(exercises) || _.isEmpty(workout)
  if (dataNotLoaded) {
    return null
  }

  const exerciseMap = _.reduce(exercises, (memo, exercise) => {
    memo[exercise.id] = exercise
    return memo
  }, {})

  const mergedExercises = _.map(workout.performedExercises, ({exerciseId, sets, reps, weight}) => {
    return {
      exerciseId, sets, reps, weight,
      name: exerciseMap[exerciseId].name
    }
  })
  return _.defaults({performedExercises: mergedExercises}, workout)

}

export default createSelector(
  exerciseSelector, workoutSelector,
  toViewModel
)
