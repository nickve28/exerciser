import React from 'react'
import _ from 'lodash'

export default ({exercise}) => {
  return (
    <tr>
      <td>{exercise.name}</td>
      <td>{exercise.category}</td>
      <td>{_.truncate(exercise.description, 30)}</td>
    </tr>
  )
}