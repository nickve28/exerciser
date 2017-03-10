import React, {Component} from 'react'

import {Link} from 'react-router'
import ChipInput from 'material-ui-chip-input'
import {TextField} from 'material-ui'

import _ from 'lodash'

export default class DetailData extends Component {
  constructor(props) {
    super(props)

    const description = _.cloneDeep(_.get(props.exercise, 'description'))
    this.state = {description}
  }

  render() {
    const {exercise, categories, handleUpdate} = this.props

    return (
      <div>
        <div>
          <div style={{marginBottom: '10px'}} />

          <div style={{marginBottom: '50px'}}>
            <h3 style={{display: 'inline'}}>{exercise.name}</h3>
            <Link className="pull-right" to="/">Go back</Link>
          </div>
        </div>
        <div>
          <div>
            <p>This exercise is a {_.capitalize(exercise.type)} type exercise</p>
            <div>
              <label>Description</label>
            </div>
            <TextField
              name="description"
              value={this.state.description}
              onChange={(e, desc) => this.setState({description: desc})}
              onBlur={() => handleUpdate({description: this.state.description})}
            />
          </div>
          <div>
            <label>Categories</label>
          </div>
          <ChipInput
            dataSource={categories}
            onRequestAdd={category => handleUpdate({categories: _.concat(exercise.categories, category)})}
            onRequestDelete={category => handleUpdate({categories: _.without(exercise.categories, category)})}
            value={exercise.categories}
          />
        </div>
      </div>
    )
  }
}
