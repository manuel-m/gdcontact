import { createElement } from 'inferno-create-element';

import shared from '../shared';

export default function Login() {
  return (
    <div class="centered-wrapper">
      <div class="centered-content text-primary-color">
        <h1 class="fw300">Gestion des contacts</h1>
        <form class="auth default-primary-color shadow" onSubmit={loginRequest}>
          <div>
            <input type="text" placeholder="Login" />
          </div>
          <div>
            <input type="password" placeholder="Mot de passe" />
          </div>
          <div>
            <input type="submit" value="Connexion" />
          </div>
        </form>
      </div>
    </div>
  );
}

function loginRequest(event) {
  const { root } = shared;
  event.preventDefault();
  root.setState({ connected: true });
}
