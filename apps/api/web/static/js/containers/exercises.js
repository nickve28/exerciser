import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises, saveExercise, fetchCategories, deleteExercise} from '../actions/index'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'
import ExerciseForm from '../components/exercise_form'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table'
import {Snackbar} from 'material-ui'


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
    return this.props.saveExercise(exercise).then(() => {
      this.loadData()
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
        <div style={{marginBottom: '10px'}} />
        <h3 style={{display: 'inline'}} >Exercises ({this.props.exerciseCount})</h3>
        <Table>
          <TableBody displayRowCheckbox={false}>
            {
              //Temporary workaround until its clear why tableheader creates a new table
            }
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Categories</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
            {_.map(this.props.exercises, exercise => {
              return (
                <ExerciseEntry key={exercise.id}exercise={exercise} onDelete={() => this._handleDelete(exercise)} />
              )
            })}
          </TableBody>
        </Table>
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

function mapStateToProps(state) {
  return {
    exercises: state.exercises.exercises,
    exerciseCount: state.exercises.count,
    categories: state.categories,
    showNoExerciseDeleted: state.notifications.showNoExerciseDeleted
  }
}

export default connect(mapStateToProps, {fetchExercises, saveExercise, fetchCategories, deleteExercise})(Exercises)
