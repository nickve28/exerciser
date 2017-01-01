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
    this.props.loginUser(this.state.username, this.state.password).then(({payload}) => {
      if (payload && payload.error)
        this.setState(_.merge({}, this.state, {error: "Login failed"}))
      return
    })
  }

  render() {
    return (
      <div className="container container-fluid">
        <h3>Log in</h3>
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

export default connect(null, {loginUser})(LoginForm)
