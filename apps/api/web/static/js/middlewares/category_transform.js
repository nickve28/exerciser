import { reduce } from 'lodash'

import { FETCH_CATEGORIES } from 'sections/exercises/actions/category'

const middleware = () => next => action => {
  if (action.type !== FETCH_CATEGORIES || action.status !== 'success') {
    return next(action)
  }

  const { payload } = action
  const transformedPayload = reduce(payload.categories, (memo, category) => ({
    ...memo, [category]: {id: category}
  }), {})

  const newAction = {
    ...action,
    payload: { ...payload, categories: transformedPayload }
  }

  return next(newAction)
}

export default middleware