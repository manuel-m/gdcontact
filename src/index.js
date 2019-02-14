import { render, Component } from 'inferno';
import { createElement } from 'inferno-create-element';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 33,
    };
  }
  render() {
    return (
      <div>
        <h1>Header!</h1>
        <span>Counter is at: {this.state.counter}</span>
      </div>
    );
  }
}

render(<MyComponent />, document.getElementById('app'));
