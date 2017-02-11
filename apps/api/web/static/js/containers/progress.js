import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchProgress} from '../actions/index'

class Progress extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchProgress({exerciseId: 244})
  }

  render() {
    const {progress} = this.props
    if (!progress) {
      return <div>Loading...</div>
    }
    return <div>{JSON.stringify(this.props.progress)}</div> //<ProgressOverview progress={progress} />
  }
}

const mapStateToProps = ({progress}) => {
  return {progress}
}

export default connect(mapStateToProps, {fetchProgress})(Progress)

