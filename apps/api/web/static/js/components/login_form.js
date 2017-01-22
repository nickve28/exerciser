import React, {Component} from 'react'
import _ from 'lodash'

import {TextField, RaisedButton, CircularProgress} from 'material-ui'

const FIELDS = {
  username: {
    name: 'username',
    type: 'text',
    value: 'username'
  },
  password: {
    name: 'password',
    type: 'password',
    value: 'password'
  }
}

export default class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {username: '', password: ''}

    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
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

  renderField({name, type, value}, onChange) {
    return (
      <div className="form-group">
        <TextField type={type} name={name} value={this.state[value]} onChange={onChange} />
      </div>
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
            {this.renderField(FIELDS.username, this.onUsernameChange)}
          </div>
          <div className="form-group">
            <div><label>Password</label></div>
            {this.renderField(FIELDS.password, this.onPasswordChange)}
          </div>
          <div className="top-padding-20">
            <RaisedButton label="Log in" primary={true} onClick={this.onFormSubmit} style={{marginRight: '10px'}} />
            {loginText(this.props.loginState)}
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
