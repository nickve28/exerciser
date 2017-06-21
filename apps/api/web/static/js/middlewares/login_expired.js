import { USER_LOGIN } from '../actions/authentication'

const middleware = () => next => action => {
  if (action.type === USER_LOGIN && action.status === 'expired') {
    localStorage.removeItem('auth_token')
  }
  return next(action)
}

export default middleware