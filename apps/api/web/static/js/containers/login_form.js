import React, {Component} from 'react'
import {connect} from 'react-redux'
import {loginUser} from '../actions/index'
import _ from 'lodash'

class LoginForm extends Component {
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

  render() {
    return (
      <div className="container container-fluid">
        <h3>Log in</h3>
        <div>
          {loginText(this.props.loginState)}
        </div>
        <div className="error-text">{this.state.error}</div>
        <form className="form">
          <div className="form-group">
            <label>Username</label>
            <input type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </div>
          <button className="btn btn-primary" onClick={this.onFormSubmit}>Log in</button>
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
    return <div>Logging in...</div>
  }
  return ''
}

function mapStateToProps(state) {
  return {
    loginState: state.authentication.loginState
  }
}

export default connect(mapStateToProps, {loginUser})(LoginForm)
