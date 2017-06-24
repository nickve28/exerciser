import AuthenticateMiddleware from './authenticate'
import LoggedInMiddleware from './logged_in'
import LoginExpiredMiddleware from './login_expired'
import createApiMiddleware from './api_middleware'
import configs from './config'

const middlewares = [
  AuthenticateMiddleware,
  LoggedInMiddleware,
  LoginExpiredMiddleware,
  ...configs.map(createApiMiddleware)
]

export default middlewares

