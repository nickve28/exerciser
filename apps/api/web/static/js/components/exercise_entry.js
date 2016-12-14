import React from 'react'

export default ({exercise}) => {
  return (
    <tr>
      <td>{exercise.name}</td>
      <td>{exercise.category}</td>
      <td>{exercise.description}</td>
    </tr>
  )
}