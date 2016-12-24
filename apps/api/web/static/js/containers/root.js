import React from 'react'
import {connect} from 'react-redux'

import { Router, Route, browserHistory } from 'react-router'

import Me from './me'
import LoginForm from './login_form'
import NavigationBar from '../components/navigation_bar'

import _ from 'lodash'

class Root extends React.Component {
  render() {
    if (!_.get(this.props, 'authentication.token')) {
      return <LoginForm />
    }

    return (
      <div>
        <div>
          <NavigationBar />
        </div>
        <div>
          <Me />
          {this.props.children}
        </div>
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
