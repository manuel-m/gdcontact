import shared from './shared';
import api from './api';

const actions = {
  'contacts.list'() {
    const payload = {
      page: shared.contacts.page,
      search: shared.contacts.search,
    };
    console.log(payload);
    return api.post('/api/contacts', payload).then(res => {
      console.log(res);
      shared.root.setState({ connected: true, route: 'contacts' });
    });
  },
};

export default function(actionId, payload) {
  return actions[actionId](payload);
}
