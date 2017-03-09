import React from 'react'

export default ({exercise}) => {
  return (
    <ul key={exercise.exerciseId} className="list-group" style={{marginTop: '5px'}}>
      <li className="list-group-item">Name: {exercise.name}</li>
      <li className="list-group-item">Sets: {exercise.sets}</li>
      <li className="list-group-item">Reps: {exercise.reps}</li>
      <li className="list-group-item">Weight: {exercise.weight}</li>
    </ul>
  )
}