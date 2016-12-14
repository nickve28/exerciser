//import "phoenix_html"

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import App from './components/app'
import reducers from './reducers/index'

import Exercises from './containers/exercises'
import Me from './containers/me'

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div>
      <Me />
      <Exercises />
    </div>
  </Provider>
  , document.querySelector('#root'))