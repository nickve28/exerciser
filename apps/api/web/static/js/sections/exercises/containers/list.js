import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { map } from 'lodash'

import Title from 'components/title'
import ListView from 'components/list_view'

import { fetchExercises, deleteExercise } from '../actions/exercise'

import ExerciseViewItem from '../components/exercise_view_item'

const ExerciseList = ({ exercises, count, fetch, remove }) => {
  fetch()

  return (
    <div className="content">
      <Title title="Exercises" count={count}>
        <Link className="pull-right" to="/exercises/new">Create exercise </Link>
      </Title>
      <ListView>
        {
          map(exercises, exercise =>
            <ExerciseViewItem
              key={exercise.id}
              exercise={exercise}
              onDelete={() => remove(exercise.id)}
            />
          )
        }
      </ListView>
    </div>
  )
}

const mapStateToProps = state => ({
  exercises: state.exercises.data.entities,
  count: state.exercises.data.count
})

const mapDispatchToProps = {
  fetch: fetchExercises,
  remove: deleteExercise
}
export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList)