//import "phoenix_html"

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import reducers from './reducers/index'

import Root from './containers/root'
import Exercises from './containers/exercises'
import ExerciseDetails from './containers/exercises/details'
import Workouts from './containers/workouts'
import WorkoutDetail from './containers/workout_detail'
import NewWorkout from './containers/new_workout'
import EditWorkout from './containers/edit_workout'

import Progress from './containers/progress'

import injectTapEventPlugin from 'react-tap-event-plugin'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(ReduxThunk)
)

const store = createStore(reducers, enhancer)

injectTapEventPlugin()

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/" component={Root}>
        <IndexRoute component={Exercises} />
        <Route path ="/exercises/:id" component={ExerciseDetails} />
        <Route path ="/workouts" component={Workouts} />
        <Route path="/workouts/new" component={NewWorkout} />
        <Route path="/workouts/:id" component={WorkoutDetail} />
        <Route path="/workouts/:id/edit" component={EditWorkout} />
        <Route path="/progress" component={Progress} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('#root'))