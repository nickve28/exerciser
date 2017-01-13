import React, {Component} from 'react'
import {saveExercise} from '../actions/index'
import _ from 'lodash'

import Select, { Creatable } from 'react-select';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ExerciseForm extends Component {
  constructor(props) {
    super(props)
    this.state = {name: '', description: '', categories: [], pageData: {showForm: false}}
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault()
    return this.props.handler(e, _.omit(this.state, 'pageData')).then(() => {
      return this.setState({name: '', description: '', categories: [], pageData: {showForm: false}})
    })
  }

  _setProperty(prop, e) {
    if (prop === 'categories') {
      const newState = _.cloneDeep(this.state)
      newState.categories = e
      return this.setState(newState)
    }
    return this.setState(_.merge({}, this.state, {[prop]: e.target.value}))
  }

  formToggle(e) {
    e.preventDefault()
    this.setState(_.merge({}, this.state, {pageData: {showForm: !this.state.pageData.showForm}}))
  }


  render() {
    if (this.state.pageData.showForm) {
      return (
        <div>
          <form className="form">
            <div className="form-group">
              <div><label>Name</label></div>
              <TextField name="name" value={this.state.name} onChange={(e) => this._setProperty('name', e)} />
            </div>

            <div className="form-group">
              <div><label>Categories</label></div>
              <Creatable
                name="categories"
                multi={true}
                options={mapCategories(this.props.categories)}
                value={this.state.categories}
                onChange={(e) => this._setProperty('categories', e)}
              />
            </div>

            <div className="form-group">
              <div><label>Description</label></div>
              <TextField name="description" value={this.state.description} onChange={(e) => this._setProperty('description', e)} />
            </div>
            <RaisedButton label="Submit" primary={true} onClick={this._handleSubmit} />
          </form>
        </div>
      )
    } else {
      return (
        <RaisedButton label="Create Exercise" primary={true} onClick={(e) => this.formToggle(e)} />
      )
    }
  }
}

const mapCategories = (categories) => {
  return _.map(categories, category => {
    return {value: category, label: category}
  })
}