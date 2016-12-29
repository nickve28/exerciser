import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkoutsAndExercises, deleteWorkout} from '../actions/index'
import {Link} from 'react-router'

import _ from 'lodash'

import WorkoutEntry from '../components/workout_entry'

class Workouts extends Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    this.props.fetchWorkoutsAndExercises()
  }

  onDelete({id}) {
    this.props.deleteWorkout(id).then(() => {
      this.props.fetchWorkoutsAndExercises()
    })
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
              return <WorkoutEntry key={workout.id} workout={workout} onDelete={_.partial(this.onDelete, workout} />
            })
          }
        <li className="show-more-li-non-styled">
          <button className="btn btn-success">Show more</button>
        </li>
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