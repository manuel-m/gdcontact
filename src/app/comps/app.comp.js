import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';

import Nav from './navbar.comp';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="dark-primary-color shadow">
        <Nav m={this.props.m} />
      </div>
    );
  }
}
