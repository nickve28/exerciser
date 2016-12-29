import React, {Component} from 'react'
import { Link } from 'react-router'

export default () => {
  return (
    <div>
      <nav className="navbar-app">
        <div className="container container-fluid app-container">
          <ul className="nav navbar-nav ">
            <li><Link to={'/'}>Exercises</Link></li>
            <li><Link to={'/workouts'}>Workouts</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}