import React, {Component} from 'react'
import { Link } from 'react-router'

import _ from 'lodash'

export default ({user}) => {
  return (
    <div>
      <div className="color-bar" />
      <nav className="navbar-app" id="navigation">
        <div>
          <ul className="nav navbar-nav">
            <li><Link to={'/'}>Exercises</Link></li>
            <li><Link to={'/workouts'}>Workouts</Link></li>
            <li className="float-right">
              {!_.isEmpty(user) ? (<div className="user-nav">
                <i className="user-nav-icon zmdi zmdi-account zmdi-hc-4x" />
                <span className="user-nav-data">{user.name}</span>
              </div>) : ''}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}