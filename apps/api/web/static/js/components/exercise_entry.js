import React from 'react'

import {Link} from 'react-router'

export default ({exercise, onDelete}) => {
  return (
    <li className="list-group-item" key={exercise.id}>
      <div className="pull-right">
        <button className="btn btn-xs btn-danger" style={{marginLeft: '5px'}} onClick={onDelete}>x</button>
      </div>
      <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
    </li>
  )
}