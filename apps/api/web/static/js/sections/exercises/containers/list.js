import React from 'react'

import Title from 'components/title'
import ListView from 'components/list_view'

import ExerciseViewItem from '../components/exercise_view_item'

const exercises = [
  {name: "foo", id: 1},
  {name: "bar", id: 2},
  {name: "baz", id: 3}
]

export default () => {
  return (
    <div className="content">
      <Title title="Exercises" count={0} />
      <ListView>
        {
          exercises.map(exercise => <ExerciseViewItem key={exercise.id} exercise={exercise} />)
        }
      </ListView>
    </div>
  )
}