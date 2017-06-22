import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Snackbar} from 'material-ui'
import _ from 'lodash'

import {loginUser} from '../actions/index'
import LoginForm from '../components/login_form'

class Login extends Component {
  renderNotification(showDialog) {
    return (
      <Snackbar
        open={showDialog || false}
        message="Your login session expired. Please log in."
        onRequestClose={_.noop}
      />
    )
  }

  render() {
    return (
      <span>
        <LoginForm loginUser={this.props.loginUser} loginState={this.props.loginState} />
        {this.renderNotification(this.props.notifications.showLoginExpired)}
      </span>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loginState: state.authentication.loginState,
    notifications: state.notifications
  }
}

export default connect(mapStateToProps, { loginUser })(Login)