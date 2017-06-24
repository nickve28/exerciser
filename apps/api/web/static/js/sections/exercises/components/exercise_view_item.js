import React from 'react'

import { Link } from 'react-router'

export default ({ exercise }) => {
  return  <li className="list-view-group-item" key={exercise.id}>
    <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
    <button className="btn btn-warning btn-danger btn-xs">x</button>
  </li>
}