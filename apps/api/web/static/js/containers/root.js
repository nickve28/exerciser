import React from 'react'
import {connect} from 'react-redux'

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
        <Exercises />
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
