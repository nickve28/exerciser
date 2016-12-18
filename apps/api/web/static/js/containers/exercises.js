import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises, saveExercise} from '../actions/index'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'
import ExerciseForm from '../components/exercise_form'

class Exercises extends Component {
  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillMount() {
    this.props.fetchExercises()
  }

  _handleSubmit(e, exercise) {
    e.preventDefault()
    return this.props.saveExercise(exercise).then(() => {
      return this.props.fetchExercises()
    })
  }

  render() {
    const {exercises} = this.props
    return (
      <div>
        <ExerciseForm handler={this._handleSubmit} />
        <h3>Exercise List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(exercises, (exercise) => {
                return <ExerciseEntry key={exercise.id} exercise={exercise} />
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
    exercises: state.exercises
  }
}

export default connect(mapStateToProps, {fetchExercises, saveExercise})(Exercises)
