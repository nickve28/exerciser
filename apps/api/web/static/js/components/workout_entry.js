import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import moment from 'moment'

export default ({workout, onDelete}) => {
  const formatted_date = moment(workout.workout_date).format('YYYY-MM-DD')
  return (
    <li className="list-group-item">
      <div className="pull-right">
        {formatted_date}
        <button className="btn btn-xs btn-danger" style={{marginLeft: '5px'}} onClick={onDelete}>x</button>
      </div>
      <Link to={`/workouts/${workout.id}`}>{workout.description}</Link>
    </li>
  )
}