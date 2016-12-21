import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises, saveExercise, fetchCategories, deleteExercise} from '../actions/index'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'
import ExerciseForm from '../components/exercise_form'

import Promise from 'bluebird'

class Exercises extends Component {
  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  componentWillMount() {
    return this.loadData()
  }

  loadData() {
    return Promise.join(
      this.props.fetchExercises(),
      this.props.fetchCategories()
    )
  }

  _handleSubmit(e, exercise) {
    e.preventDefault()
    exercise.categories = _.map(exercise.categories, 'value')
    //maybe introduce bluebird and make it parallel
    return this.props.saveExercise(exercise).then(() => {
      return this.loadData()
    })
  }

  _handleDelete(exercise) {
    const {id} = exercise
    return this.props.deleteExercise(id).then(() => {
      return this.loadData()
    })
  }

  render() {
    const {exercises} = this.props
    return (
      <div>
        <ExerciseForm handler={this._handleSubmit} categories={this.props.categories} />
        <h3>Exercise List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(exercises, (exercise) => {
                return <ExerciseEntry key={exercise.id} exercise={exercise} onDelete={() => this._handleDelete(exercise)} />
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exercises: state.exercises,
    categories: state.categories
  }
}

export default connect(mapStateToProps, {fetchExercises, saveExercise, fetchCategories, deleteExercise})(Exercises)
