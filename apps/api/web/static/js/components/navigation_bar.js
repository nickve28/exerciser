import React, {Component} from 'react'
import { Link } from 'react-router'

import _ from 'lodash'

import {Popover, Menu} from 'material-ui'
import MediaQuery from 'react-responsive'

const smallDeviceQuery = '(max-device-width: 1024px)'
const largeDeviceQuery = '(min-device-width: 1024px)'

const renderPopOver = (openDialog, anchorEl, handleRequestClose) => {
  return (
    <Popover
        open={openDialog}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={handleRequestClose}
      >
        <Menu>
        </Menu>
    </Popover>
  )
}

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
                {!_.isEmpty(user) ? (<span>
                  <MediaQuery query={largeDeviceQuery} component="div" className="user-nav">
                    <i className="user-nav-icon zmdi zmdi-account zmdi-hc-4x" onClick={this.handleUserClick} />
                    <span className="user-nav-data">{user.name}</span>
                    {renderPopOver(this.state.openDialog, this.state.anchorEl, this.handleRequestClose)}
                  </MediaQuery>

                  <MediaQuery query={smallDeviceQuery} component="div" className="user-nav">
                    <i className="user-nav-icon zmdi zmdi-account zmdi-hc-2x" onClick={this.handleUserClick} />
                    <span className="user-nav-data">{user.name}</span>
                    {renderPopOver(this.state.openDialog, this.state.anchorEl, this.handleRequestClose)}
                  </MediaQuery>
                </span>) : ''}
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

