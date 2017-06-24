import {
  FETCH_EXERCISE,
  FETCH_EXERCISES,
  CREATE_EXERCISE,
  UPDATE_EXERCISE,
  DELETE_EXERCISE,
  FETCH_CATEGORIES
} from '../actions/index'

const category = {
  actions: {
    [FETCH_CATEGORIES]: ['categories'],
    cache: [FETCH_CATEGORIES],
    cacheTime: 2
  }
}

const exercises = {
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

export default [
  category,
  exercises
]