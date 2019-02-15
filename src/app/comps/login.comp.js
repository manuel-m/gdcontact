import { linkEvent } from 'inferno';
import { createElement } from 'inferno-create-element';

export default function Login(props) {
  return (
    <div class="centered-wrapper">
      <div class="centered-content">
        <h1>Gestion des contacts</h1>
        <form class="auth" onSubmit={linkEvent(props, loginRequest)}>
          <input type="text" placeholder="Login" />
          <input type="password" placeholder="Mot de passe" />
          <input type="submit" value="Connexion" />
        </form>
      </div>
    </div>
  );
}

function loginRequest(props, event) {
  event.preventDefault();
  props.root.setState({ connected: true });
}
