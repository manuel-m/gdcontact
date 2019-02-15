import { render, Component } from 'inferno';
import { createElement } from 'inferno-create-element';

import App from './app/comps/app.comp';
import Login from './app/comps/login.comp';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      failedConnection: false,
    };
  }
  render() {
    return this.state.connected === true ? (
      <App root={this} />
    ) : (
      <Login root={this} />
    );
  }
}

render(<Root />, document.getElementById('root'));
