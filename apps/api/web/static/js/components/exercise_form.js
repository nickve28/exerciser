import React, {Component} from 'react'
import _ from 'lodash'

import {TextField, RaisedButton, MenuItem, SelectField} from 'material-ui'
import ChipInput from 'material-ui-chip-input'

import Promise from 'bluebird' //eslint-disable-line

const EXERCISE_TYPES = ['strength', 'endurance']

const renderItems = () => {
  return _.map(EXERCISE_TYPES, type => {
    return (
      <MenuItem
        key={type}
        value={type}
        primaryText={type}
      />
    )
  })
}

export default class ExerciseForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      type: null,
      categories: [],
      pageData: {showForm: false}
    }
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault()
    return this.props.handler(e, _.omit(this.state, 'pageData')).then(() => {
      return this.setState({name: '', description: '', categories: [], pageData: {showForm: false}})
    }).catch(() => {
      return true
    })
  }

  _setProperty(prop, e) {
    if (prop === 'categories') {
      const newState = _.cloneDeep(this.state)
      newState.categories = e
      return this.setState(newState)
    }

    if (prop === 'type') {
      return this.setState({type: e})
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
        <div className="fadein">
          <form className="form">
            <div className="form-group">
              <div><label>Name</label></div>
              <TextField name="name" value={this.state.name} onChange={(e) => this._setProperty('name', e)} />
            </div>

            <div className="form-group">
              <div><label>Categories</label></div>
              <ChipInput
                dataSource={this.props.categories}
                onChange={categories => this._setProperty('categories', categories)}
              />
            </div>

            <div className="form-group">
              <div><label>Description</label></div>
              <TextField name="description" value={this.state.description} onChange={(e) => this._setProperty('description', e)} />
            </div>

            <div className="form-group">
              <div><label>Type</label></div>
              <SelectField
                floatingLabelText="Exercise Type"
                value={this.state.type}
                onChange={(event, index, type) => this._setProperty('type', type)}
              >
                {renderItems()}
              </SelectField>
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
