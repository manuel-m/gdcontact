import shared from './shared';
import api from './api';

const actions = {
  'config.load': configLoad,
  'contacts.list': contactsList,
};

export default function(actionId, payload) {
  return actions[actionId](payload);
}

async function configLoad() {
  shared.config = await api.get('config.json');

  // contacts mapping
  {
    const { format } = shared.config.contacts;
    format.map = format.columns.reduce((o, v, i) => {
      o[v] = i;
      return o;
    }, {});
  }
}

async function contactsList() {
  const payload = {
    page: shared.contacts.page,
    search: shared.contacts.search,
  };
  const items = await api.post('/api/contacts', payload);
  shared.contacts.items = items;
  console.log(shared.contacts.items);
  shared.root.setState({ connected: true, route: 'contacts' });
}
