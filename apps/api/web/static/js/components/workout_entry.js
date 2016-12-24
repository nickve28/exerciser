import React from 'react'
import _ from 'lodash'

export default ({workout}) => {
  return (
    <tr>
      <td>{workout.workout_date}</td>
      <td>{workout.description}</td>
      <td>{
        _.join(_.map(workout.performed_exercises, 'name'), ',')
      }</td>
      <td></td>
    </tr>
  )
}