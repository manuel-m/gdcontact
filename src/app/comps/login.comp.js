import { linkEvent } from 'inferno';
import { createElement } from 'inferno-create-element';

export default function Login(props) {
  return (
    <div class="centered-wrapper">
      <div class="centered-content text-primary-color">
        <h1 class="fw300">Gestion des contacts</h1>
        <form
          class="auth default-primary-color shadow"
          onSubmit={linkEvent(props, loginRequest)}
        >
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

function loginRequest(props, event) {
  event.preventDefault();
  props.m.setState({ connected: true });
}
