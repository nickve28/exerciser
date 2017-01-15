import React, {Component} from 'react'
import {connect} from 'react-redux'
import {loginUser} from '../actions/index'
import _ from 'lodash'

import {TextField, RaisedButton, CircularProgress, Snackbar} from 'material-ui'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {username: '', password: ''}

    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.renderNotification = this.renderNotification.bind(this)

  }

  onUsernameChange(e) {
    const state = this.state
    const username = e.target.value
    this.setState(_.merge({}, state, {username}))
  }

  onPasswordChange(e) {
    const state = this.state
    const password = e.target.value
    this.setState(_.merge({}, state, {password}))
  }

  onFormSubmit(e) {
    e.preventDefault()
    this.props.loginUser(this.state.username, this.state.password)
  }

  handleRequestClose() {
    this.setState(_.defaults({showNotification: false}, this.state))
  }

  renderNotification() {
    return (
      <Snackbar
        open={this.props.showNotification}
        message="Your login session expired. Please log in."
        autoHideDuration={5000}
      />
    )
  }

  render() {
    return (
      <div className="container container-fluid">
        <h3>Log in</h3>
        <div className="error-text">{this.state.error}</div>
        <form className="form">
          <div className="form-group">
            <div><label>Username</label></div>
            <TextField type="text"
              name="username"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
          </div>
          <div className="form-group">
            <div><label>Password</label></div>
            <TextField
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </div>
          <div className="top-padding-20">
            <RaisedButton label="Log in" primary={true} onClick={this.onFormSubmit} style={{marginRight: '10px'}} />
            {loginText(this.props.loginState)}
            {this.renderNotification()}
          </div>
        </form>
      </div>
    )
  }
}

const loginText = (loginState) => {
  if (loginState === 'login_failure') {
    return <div className="error-text">Login failed</div>
  }
  if (loginState === 'logging_in') {
    return <CircularProgress size={23} />
  }
  return ''
}

function mapStateToProps(state) {
  return {
    loginState: state.authentication.loginState,
    showNotification: state.authentication.loginState === 'logged_out' ? true : false
  }
}

export default connect(mapStateToProps, {loginUser})(LoginForm)
