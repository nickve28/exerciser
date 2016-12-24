//import "phoenix_html"

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import App from './components/app'
import reducers from './reducers/index'

import Root from './containers/root'
import Exercises from './containers/exercises'
import Workouts from './containers/workouts'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div>
      <Router history={browserHistory}>
        <Route path="/" component={Root}>
          <IndexRoute component={Exercises} />
          <Route path ="workouts" component={Workouts} />
        </Route>
      </Router>
    </div>
  </Provider>
  , document.querySelector('#root'))