import {
  FETCH_EXERCISE,
  FETCH_EXERCISES,
  CREATE_EXERCISE,
  UPDATE_EXERCISE,
  DELETE_EXERCISE,
  FETCH_CATEGORIES,
  FETCH_WORKOUTS,
  FETCH_WORKOUT
} from '../actions/index'

const category = {
  plural: 'categories',
  actions: {
    [FETCH_CATEGORIES]: ['categories']
  },
  cache: [FETCH_CATEGORIES],
  cacheTime: 5
}

const exercises = {
  plural: 'exercises',
  actions: {
    [FETCH_EXERCISES]: ['exercises', 'exerciseCount'],
    [FETCH_EXERCISE]: ['exercise'],
    [CREATE_EXERCISE]: ['createExercise'],
    [UPDATE_EXERCISE]: ['updateExercise'],
    [DELETE_EXERCISE]: ['deleteExercise']
  },
  cache: [FETCH_EXERCISE, FETCH_EXERCISES],
  cacheTime: 5
}

const workouts = {
  plural: 'workouts',
  actions: {
    [FETCH_WORKOUTS]: ['me.workouts', 'me.workoutCount'],
    [FETCH_WORKOUT]: ['workout']
  },
  cache: [FETCH_WORKOUTS, FETCH_WORKOUT],
  cacheTime: 5
}
export default [
  category,
  exercises,
  workouts
]