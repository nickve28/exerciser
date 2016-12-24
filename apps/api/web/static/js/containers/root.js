import React from 'react'
import {connect} from 'react-redux'

import { Router, Route, Link, browserHistory } from 'react-router'

import Exercises from './exercises'
import Me from './me'
import LoginForm from './login_form'

import _ from 'lodash'

class Root extends React.Component {
  render() {
    if (!_.get(this.props, 'authentication.token')) {
      return <LoginForm />
    }

    return (
      <div>
        <Me />
        <Router history={browserHistory}>
          <Route path="/" component={Exercises} />
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  }
}

export default connect(mapStateToProps)(Root)
