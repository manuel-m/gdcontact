import { linkEvent } from 'inferno';
import { createElement } from 'inferno-create-element';

export default function Navbar(props) {
  return (
    <div class="nav text-primary-color">
      <div class="nav__left">
        <span class="nav__item">Item 1</span>
        <span class="nav__item selected">Item 2</span>
      </div>
      <div class="nav__right">
        <span class="nav__item" onClick={linkEvent(props, disconnect)}>
          Déconnexion
        </span>
      </div>
    </div>
  );
}

function disconnect(props, event) {
  event.preventDefault();
  props.m.setState({ connected: false });
}
