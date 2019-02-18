import { createElement } from 'inferno-create-element';

import action from '../action';

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

async function loginRequest(event) {
  event.preventDefault();
  await action('config.load');
  action('contacts.list');
}
