import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkouts, deleteWorkout} from '../actions/index'
import {Link} from 'react-router'

import _ from 'lodash'

import {RaisedButton, Snackbar} from 'material-ui'

import WorkoutEntry from '../components/workout_entry'

class Workouts extends Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
    this.renderMoreButton = this.renderMoreButton.bind(this)
    this.loadWorkouts = this.loadWorkouts.bind(this)
  }

  componentWillMount() {
    this.props.fetchWorkouts()
  }

  onDelete({id}) {
    this.props.deleteWorkout(id).then(() => {
      this.props.fetchWorkouts()
    })
  }

  loadWorkouts(limit, offset) {
    this.props.fetchWorkouts(limit, offset, {append: true})
  }

  renderMoreButton() {
    const {workouts, count} = this.props
    const moreAvailable = workouts && workouts.length < count

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
    const {workouts, count} = this.props
    return (
      <div>
        <div style={{marginBottom: '10px'}} />

        <div style={{marginBottom: '50px'}}>
          <h3 style={{display: 'inline'}}>Workouts ({count})</h3>
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
        {renderNotification(this.props.notifications)}

      </div>
    )
  }
}

function renderNotification(notificationInfo) {
  return (
    <Snackbar
      open={notificationInfo.showWorkoutDeleted}
      message="The workout has been deleted."
    />
  )
}

function mapStateToProps(state) {
  return {
    workouts: state.workouts.workouts,
    count: state.workouts.workoutCount,
    notifications: state.notifications
  }
}

export default connect(mapStateToProps, {fetchWorkouts, deleteWorkout})(Workouts)