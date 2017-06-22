import AuthenticateMiddleware from './authenticate'
import LoggedInMiddleware from './logged_in'
import LoginExpiredMiddleware from './login_expired'

const middlewares = [
  AuthenticateMiddleware,
  LoggedInMiddleware,
  LoginExpiredMiddleware
]

export default middlewares

