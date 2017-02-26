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
    this.toggleMenu = this.toggleMenu.bind(this)

    this.state = {openDialog: false, showMenu: false}
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

  toggleMenu() {
    this.setState({showMenu: !this.state.showMenu})
  }

  render() {
    const {user} = this.props
    const username = _.get(user, 'name', '')
    const showMenu = this.state.showMenu ? 'show-menu' : 'hide-menu'

    return (
      <div>
        <div className="color-bar" />
        <nav className="navbar-app" id="navigation">
          <div>
            <i href="#" className="zmdi zmdi-menu zmdi-hc-2x white-icon menu-nav" onClick={this.toggleMenu} />
            <span className="float-right show-mobile user-name">{username}</span>
            <ul className={`nav navbar-nav ${showMenu}`}>
              <li><Link to={'/'} onClick={this.toggleMenu}>Exercises</Link></li>
              <li><Link to={'/workouts'} onClick={this.toggleMenu}>Workouts</Link></li>
              <li><Link to={'/progress'} onClick={this.toggleMenu}>Progress</Link></li>
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

