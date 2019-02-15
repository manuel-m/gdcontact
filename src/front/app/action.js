import shared from './shared';
import api from './api';

const actions = {
  'contacts.list': contactsList,
};

export default function(actionId, payload) {
  return actions[actionId](payload);
}

async function contactsList() {
  const payload = {
    page: shared.contacts.page,
    search: shared.contacts.search,
  };
  const items = await api.post('/api/contacts', payload);
  shared.contacts.items = items;
  shared.root.setState({ connected: true, route: 'contacts' });
}
