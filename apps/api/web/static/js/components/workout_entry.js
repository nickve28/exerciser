import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

export default ({workout}) => {
  return (
    <tr>
      <td><Link to={`/workouts/${workout.id}`}>{workout.workout_date}</Link></td>
      <td>{workout.description}</td>
      <td>{
        _.join(_.map(workout.performed_exercises, 'name'), ',')
      }</td>
      <td></td>
    </tr>
  )
}