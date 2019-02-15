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
      router: {
        current: 'contacts',
      },
    };
  }
  render() {
    return this.state.connected === true ? (
      <App m={this} />
    ) : (
      <Login m={this} />
    );
  }
}

render(<Root />, document.getElementById('root'));
