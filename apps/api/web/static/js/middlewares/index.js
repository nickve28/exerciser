import AuthenticateMiddleware from './authenticate'
import LoggedInMiddleware from './logged_in'
import LoginExpiredMiddleware from './login_expired'
import createApiMiddleware from './api_middleware'
import errorMiddleware from './error'
import configs from './config'
import CategoryTransformMiddleware from './category_transform'

const middlewares = [
  CategoryTransformMiddleware,
  AuthenticateMiddleware,
  LoggedInMiddleware,
  LoginExpiredMiddleware,
  errorMiddleware,
  ...configs.map(createApiMiddleware)
]

export default middlewares

