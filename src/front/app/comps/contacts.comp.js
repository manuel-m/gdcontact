import { createElement } from 'inferno-create-element';

import shared from '../shared';

export default function Contacts(props) {
  return (
    <div class="contacts-list">
      <div class="panel-top shadow" />
      <div class="panel-header">TEST</div>
      <div class="panel-body shadow">
        <ul>
          {shared.contacts.items.map(line => (
            <li class="contact-line">{contactLineLabel(line)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function contactLineLabel(l) {
  const { map } = shared.config.contacts.format;
  return `${l[map.last_name]} ${l[map.first_name]}`;
}
