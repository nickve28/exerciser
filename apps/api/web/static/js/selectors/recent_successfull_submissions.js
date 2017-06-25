import { CREATE_EXERCISE } from 'sections/exercises/actions/exercise'

import { createSelector } from 'reselect'

const exerciseRequestSelector = state => state.exercises.requests

const lessThanSecondsAgo = (date, seconds) => {
  const currentTime = new Date().getTime()
  const time = date.getTime()
  return currentTime < (time + 1000 * seconds)
}

export default createSelector(
  exerciseRequestSelector,
  exercisesRequests => ({
    createExercise: exercisesRequests[CREATE_EXERCISE] ?
      lessThanSecondsAgo(exercisesRequests[CREATE_EXERCISE].timestamp, 2) :
      null
  })
)
