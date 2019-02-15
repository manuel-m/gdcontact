import { render, Component } from 'inferno';
import { createElement } from 'inferno-create-element';

import App from './app/comps/app.comp';
import Login from './app/comps/login.comp';

import shared from './app/shared';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      failedConnection: false,
      route: 'contacts',
    };
    shared.root = this;
  }
  render() {
    return this.state.connected === true ? <App /> : <Login />;
  }
}

render(<Root />, document.getElementById('root'));
