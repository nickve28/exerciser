const category = {
  actions: {
    'FETCH_CATEGORIES': ['categories']
  }
}

const exercises = {
  actions: {
    'FETCH_EXERCISES': ['exercises', 'exerciseCount'],
    'FETCH_EXERCISE': ['exercise']
  }
}

export default [
  category,
  exercises
]