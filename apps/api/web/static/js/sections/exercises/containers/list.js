import React from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'

import Title from 'components/title'
import ListView from 'components/list_view'

import { fetchCategories } from '../actions/category'
import { fetchExercises, deleteExercise } from '../actions/exercise'

import ExerciseViewItem from '../components/exercise_view_item'

const ExerciseList = ({ exercises, count, fetch, remove }) => {
  fetch()

  return (
    <div className="content">
      <Title title="Exercises" count={count} />
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
  fetch: () => fetchCategories() && fetchExercises(),
  remove: deleteExercise
}
export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList)