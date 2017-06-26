import AuthenticateMiddleware from './authenticate'
import LoggedInMiddleware from './logged_in'
import LoginExpiredMiddleware from './login_expired'
import createApiMiddleware from './api_middleware'
import errorMiddleware from './error'
import configs from './config'
import CategoryTransformMiddleware from './category_transform'
import SuccessMutationRedirectMiddleware from './succesfull_mutation'
import WorkoutTransformMiddleware from './workout_transform'

const middlewares = [
  WorkoutTransformMiddleware,
  CategoryTransformMiddleware,
  AuthenticateMiddleware,
  LoggedInMiddleware,
  LoginExpiredMiddleware,
  errorMiddleware,
  SuccessMutationRedirectMiddleware,
  ...configs.map(createApiMiddleware)
]

export default middlewares

