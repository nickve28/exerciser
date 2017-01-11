import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchExercises, saveExercise, fetchCategories, deleteExercise} from '../actions/index'
import _ from 'lodash'

import ExerciseEntry from '../components/exercise_entry'
import ExerciseForm from '../components/exercise_form'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';

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
        <h3>Exercise Overview</h3>
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
