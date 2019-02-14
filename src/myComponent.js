import { render, Component } from '../node_modules/inferno/index.esm';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
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