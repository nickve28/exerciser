import React from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {shallow, mount} from 'enzyme'
import _ from 'lodash'
const muiTheme = getMuiTheme()

export const shallowRender = (node, opts = {}) => shallow(node, {
  context: _.merge({
    muiTheme: muiTheme
  }, opts)
})

export const mountRender = (node, opts = {}) => mount(node, {
  context: _.merge({
    muiTheme: muiTheme
  }, opts),
  childContextTypes: {
    muiTheme: React.PropTypes.object
  }
})