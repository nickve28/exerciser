import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises, saveExercise, fetchCategories, deleteExercise} from '../actions/index'
import {validateExerciseCreate as validate} from '../helpers/validator'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'
import ExerciseForm from '../components/exercise_form'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Snackbar} from 'material-ui'


import Promise from 'bluebird'

class Exercises extends Component {
  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
    this.loadData = this.loadData.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
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

    const validationError = validate(exercise).error
    return Promise.try(() => {
      if (!validationError) {
        return this.props.saveExercise(exercise).then(() => {
          this.loadData()
        })
      }
      throw validationError
    })
  }

  _handleDelete(exercise) {
    const {id} = exercise
    return this.props.deleteExercise(id).then(() => {
      return this.loadData()
    })
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '10px'}} />

        <div style={{marginBottom: '50px'}}>
          <h3 style={{display: 'inline'}}>Exercises ({this.props.exerciseCount})</h3>
        </div>

        <ReactCSSTransitionGroup
          component="ul"
          className="list-group"
          transitionName="listitem"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {
            _.map(_.values(this.props.exercises), exercise => {
              return <ExerciseEntry key={exercise.id} exercise={exercise} onDelete={_.partial(this._handleDelete, exercise)} />
            })
          }
        </ReactCSSTransitionGroup>
        <div className="margin-vertical">
          <ExerciseForm handler={this._handleSubmit} categories={this.props.categories} />
          <Snackbar
            open={this.props.showNoExerciseDeleted || false}
            message='The exercise is used in workouts and can not be deleted'
            onRequestClose={_.noop}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    exercises: state.exercises.exercises,
    exerciseCount: state.exercises.count,
    categories: state.categories,
    showNoExerciseDeleted: state.notifications.showNoExerciseDeleted
  }
}

export default connect(mapStateToProps, {fetchExercises, saveExercise, fetchCategories, deleteExercise})(Exercises)
