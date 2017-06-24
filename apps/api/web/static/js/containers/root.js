import React, {Component} from 'react'
import {connect} from 'react-redux'

import Login from './login'
import NavigationBar from '../components/navigation_bar'
import Notifications from 'sections/notifications/containers/notifications'

import {fetchMe} from '../actions/index'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import _ from 'lodash'


//Todo this class needs rework so components arent defined in two places, just to rerender it with data
class BodyData extends Component {
  componentDidMount() {
    this.props.fetchMe()
  }

  render() {
    const {user} = this.props

    return (
      <div>
        <div>
          <NavigationBar user={user} />
        </div>
        <div className="desktop-filler" />
        <div className="container-fluid app-container app-container-size">
          {this.props.children}
        </div>
        <Notifications />
      </div>
    )
  }
}

class Root extends Component {
  render() {
    const isLoggedIn =_.get(this.props, 'authentication.token')

    let content
    if (isLoggedIn) {
      content = <BodyData
        user={this.props.user}
        fetchMe={this.props.fetchMe}
        >
          {this.props.children}
        </BodyData>
    } else {
      content = (
        <div>
          <div><NavigationBar /></div>
          <div className="desktop-filler" />
          <div className="container-fluid app-container app-container-size">
            <Login />
          </div>
        </div>
      )
    }

    return (
      <MuiThemeProvider>
        {content}
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    user: state.me
  }
}

export default connect(mapStateToProps, {fetchMe})(Root)
