import React from 'react'
import {connect} from 'react-redux'

import { Router, Route, browserHistory } from 'react-router'

import Me from './me'
import LoginForm from './login_form'
import NavigationBar from '../components/navigation_bar'
import Banner from '../components/banner'

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
        <div className="container-fluid app-container">
          <div>
            <Banner />
          </div>
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
