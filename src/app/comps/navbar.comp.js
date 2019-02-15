import { createElement } from 'inferno-create-element';

import shared from '../shared';

export default function Navbar() {
  return (
    <div class="nav text-primary-color dark-primary-color shadow">
      <div class="nav__left">
        {NavButton('Contacts', 'contacts')}
        {NavButton('Campagnes', 'campaigns')}
      </div>
      <div class="nav__right">
        <span class="nav__item" onClick={disconnect}>
          Déconnexion
        </span>
      </div>
    </div>
  );
}

function NavButton(label, target) {
  return (
    <span
      class={
        'nav__item' + (shared.root.state.route === target ? ' selected' : '')
      }
      onClick={e => {
        e.preventDefault();
        shared.root.setState({ route: target });
      }}
    >
      {label}
    </span>
  );
}

function disconnect(event) {
  event.preventDefault();
  shared.root.setState({ connected: false });
}
