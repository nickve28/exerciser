import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises} from '../actions/index'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'

class Exercises extends Component {
  componentWillMount() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.-V4LGxEc3NHApZCeH10EZcpxil8jCFp5E500_FSfJMk'
    this.props.fetchExercises(token)
  }
  render() {
    const {exercises} = this.props
    return (
      <div>
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

export default connect(mapStateToProps, {fetchExercises})(Exercises)
