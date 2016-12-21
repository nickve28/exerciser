import React from 'react'
import _ from 'lodash'

export default ({exercise, onDelete}) => {
  return (
    <tr>
      <td>{exercise.name}</td>
      <td>{_.join(exercise.categories, ',')}</td>
      <td>{_.truncate(exercise.description, 30)}</td>
      <td><button className="btn btn-danger" onClick={onDelete} >X</button></td>
    </tr>
  )
}