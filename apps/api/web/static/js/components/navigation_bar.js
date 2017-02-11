import React, {Component} from 'react'
import { Link } from 'react-router'

import _ from 'lodash'

import {Popover, Menu, MenuItem} from 'material-ui'

export default class NavigationBar extends Component {
  constructor(props) {
    super(props)

    this.handleUserClick = this.handleUserClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)

    this.state = {openDialog: false}
  }

  handleUserClick(e) {
    e.preventDefault()

    this.setState({
      openDialog: true,
      anchorEl: e.currentTarget
    })
  }

  handleRequestClose() {
    this.setState({openDialog: false})
  }

  render() {
    const {user} = this.props


    return (
      <div>
        <div className="color-bar" />
        <nav className="navbar-app" id="navigation">
          <div>
            <ul className="nav navbar-nav">
              <li><Link to={'/'}>Exercises</Link></li>
              <li><Link to={'/workouts'}>Workouts</Link></li>
              <li><Link to={'/progress'}>Progress</Link></li>
              <li className="float-right">
                {!_.isEmpty(user) ? (<div className="user-nav">
                  <i className="user-nav-icon zmdi zmdi-account zmdi-hc-4x" onClick={this.handleUserClick} />
                  <span className="user-nav-data">{user.name}</span>
                  <Popover
                    open={this.state.openDialog}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                  >
                    <Menu>
                    </Menu>
                  </Popover>
                </div>) : ''}
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

