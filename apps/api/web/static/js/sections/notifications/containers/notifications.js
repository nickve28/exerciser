import React from 'react'
import { connect } from 'react-redux'
import { noop } from 'lodash'
import { Snackbar } from 'material-ui'

//needs rework once all notification are housed here
const Notifications = ({ showNoExerciseDeleted }) => {
  return <div>
    <Snackbar
      open={showNoExerciseDeleted || false}
      message='The exercise is used in workouts.'
      onRequestClose={noop}
    />
  </div>
}

const mapStateToProps = state => ({
  showNoExerciseDeleted: state.notifications.showNoExerciseDeleted
})

export default connect(mapStateToProps)(Notifications)