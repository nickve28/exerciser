import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {shallow} from 'enzyme'
const muiTheme = getMuiTheme()

export const shallowRender = (node) => shallow(node, {
  context: {
    muiTheme: muiTheme
  }
});
