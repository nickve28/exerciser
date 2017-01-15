import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkoutsAndExercises, deleteWorkout} from '../actions/index'
import {Link} from 'react-router'

import _ from 'lodash'

import {RaisedButton} from 'material-ui'

import WorkoutEntry from '../components/workout_entry'

class Workouts extends Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
    this.renderMoreButton = this.renderMoreButton.bind(this)
    this.loadWorkouts = this.loadWorkouts.bind(this)
  }

  componentWillMount() {
    this.props.fetchWorkoutsAndExercises()
  }

  onDelete({id}) {
    this.props.deleteWorkout(id).then(() => {
      this.props.fetchWorkoutsAndExercises()
    })
  }

  loadWorkouts(limit, offset) {
    this.props.fetchWorkoutsAndExercises(limit, offset, {append: true})
  }

  renderMoreButton() {
    const {workouts} = this.props
    const moreAvailable = workouts && workouts.length % 10 === 0

    if (moreAvailable) {
      const offset = workouts.length
      const limit = 10

      return (
        <li className="show-more-li-non-styled">
          <RaisedButton backgroundColor="#a4c639" labelColor="white" onClick={() => this.loadWorkouts(limit, offset)} label="Show more" />
        </li>
      )
    }
    return ''
  }

  render() {
    const {workouts} = this.props
    return (
      <div>
        <br />
        <div>
          <strong>List of recent workouts</strong>
          <Link to="/workouts/new" style={{float: 'right'}}>Add Workout</Link>
        </div>


        <ul className="list-group">
          {
            _.map(workouts, workout => {
              return <WorkoutEntry key={workout.id} workout={workout} onDelete={_.partial(this.onDelete, workout)} />
            })
          }
        {this.renderMoreButton()}
        </ul>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workouts: state.workouts.workouts
  }
}

export default connect(mapStateToProps, {fetchWorkoutsAndExercises, deleteWorkout})(Workouts)