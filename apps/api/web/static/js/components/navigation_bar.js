import React, {Component} from 'react'
import { Link } from 'react-router'

export default () => {
  return (
    <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to={'/'}>Exercises</Link></li>
              <li><Link to={'/workouts'}>Workouts</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}