import React, {Component} from 'react'
import { Link } from 'react-router'

export default () => {
  return (
    <div>
      <div className="color-bar" />
      <nav className="navbar-app" id="navigation">
        <div>
          <ul className="nav navbar-nav ">
            <li><Link to={'/'}>Exercises</Link></li>
            <li><Link to={'/workouts'}>Workouts</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}