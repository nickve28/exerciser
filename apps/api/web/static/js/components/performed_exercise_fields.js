import React, {Component} from 'react'
import { Creatable } from 'react-select';

import _ from 'lodash'

export default class PerformedExerciseFields extends Component {
  constructor(props) {
    super(props)

    this._setExercise = this._setExercise.bind(this)

    this.state = {
      exercise: null
    }
  }

  mapExercises(exercises) {
    return _.map(exercises, exercise => {
      return {value: exercise.id, label: exercise.name}
    })
  }

  _setExercise(e) {
    const newState = _.cloneDeep(this.state)
    newState.exercise = e.value
    return this.setState(newState)
  }

  render() {
    const {pExercise, index, exercises} = this.props
    return (
      <div style={{marginTop: '5px'}}>
        <h5>Performed Exercise {index + 1}</h5>
        <div className="form-group">
          <label>Exercise</label>
          <Creatable
            name={`.pExercises${index}.exercise_id`}
            options={this.mapExercises(this.props.exercises)}
            value={this.state.exercise}
            onChange={(e) => this._setExercise(e)}
          />
        </div>
        <div className="form-group">
          <label>Weight</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Sets</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Reps</label>
          <input type="text" className="form-control" />
        </div>
      </div>
    )
  }
}