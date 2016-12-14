import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMe} from '../actions/index'
import _ from 'lodash'

class Exercises extends Component {
  componentWillMount() {
    this.props.fetchMe()
  }
  render() {
    const {me} = this.props
    if (!me) {
      return <h3>Please log in</h3>
    }
    return <h3>Welcome {me.name}!</h3>
  }
}

function mapStateToProps(state) {
  return {
    me: state.me
  }
}

export default connect(mapStateToProps, {fetchMe})(Exercises)
