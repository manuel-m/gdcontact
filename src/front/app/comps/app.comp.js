import { createElement } from 'inferno-create-element';

import Nav from './navbar.comp';
import Contacts from './contacts.comp';
import Mails from './mails.comp';
import Campaigns from './campaigns.comp';

import shared from '../shared';

export default function App() {
  return (
    <div>
      <Nav />
      <Router />
    </div>
  );
}

function Router() {
  const { route } = shared.root.state;
  if (route === 'contacts') return <Contacts />;
  if (route === 'mails') return <Mails />;
  return <Campaigns />;
}
