import React from 'react'

import { Link } from 'react-router'

import DangerButton from 'components/button/danger'

export default ({ exercise, onDelete }) => {
  return  <li className="list-view-group-item" key={exercise.id}>
    <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
    <DangerButton onClick={onDelete}>x</DangerButton>
  </li>
}