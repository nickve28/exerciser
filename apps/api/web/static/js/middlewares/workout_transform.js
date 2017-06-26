import { FETCH_WORKOUTS } from 'actions/index'

const middleware = () => next => action => {
  if (action.type !== FETCH_WORKOUTS || action.status !== 'success') {
    return next(action)
  }

  const { payload } = action
  const newAction = {
    ...action,
    payload: { ...payload.me }
  }

  return next(newAction)
}

export default middleware