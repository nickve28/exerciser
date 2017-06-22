import { USER_LOGIN } from '../actions/authentication'

const middleware = () => next => action => {
  if (action.type === USER_LOGIN && action.status === 'success') {
    localStorage.setItem('auth_token', action.payload.token)
  }
  return next(action)
}

export default middleware