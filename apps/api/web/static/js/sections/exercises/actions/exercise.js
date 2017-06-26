import _ from 'lodash'

export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const FETCH_EXERCISE = 'FETCH_EXERCISE'
export const CREATE_EXERCISE = 'CREATE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const EXERCISE_NOT_DELETED = 'EXERCISE_NOT_DELETED'
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE'

export const fetchExercises = () => {
  const query = `{
    exercises {
      name, id, categories, description, type, metric
    },
    exerciseCount
  }`

  return {
    query,
    type: FETCH_EXERCISES,
    status: 'pending'
  }
}

export const fetchExercise = (id) => {
  const query = `{
    exercise(id: ${id}) {
      name, id, categories, description, type, metric
    }
  }`

  return {
    type: FETCH_EXERCISE,
    query: query,
    status: 'pending'
  }
}

export const saveExercise = ({name, description, categories, type, metric}) => {
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const query = `mutation {
    createExercise(name: "${name}", categories: [${formatted_categories}], description: "${description}", type: "${type}", metric: "${metric}") {
      name, id, categories, metric, type, description
    }
  }`

  return {
    query,
    type: CREATE_EXERCISE,
    status: 'pending'
  }
}

export const updateExercise = ({id, description, categories}) => {
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const query = `mutation {
    updateExercise(id: ${id}, categories: [${formatted_categories}], description: "${description}") {
      name, id, description, categories, type, metric
    }
  }`

  return {
    query,
    type: UPDATE_EXERCISE,
    status: 'pending'
  }
}

export const deleteExercise = (id) => {
  const query = `mutation {
    deleteExercise(id: ${id})
  }`
  return {
    query,
    type: DELETE_EXERCISE,
    status: 'pending'
  }
}
