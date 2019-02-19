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
  const groups = l[map.groups].split(
    shared.config.contacts.format.delimiters[1],
  );
  return (
    <div class="line">
      <div class="line__left">{`${l[map.last_name]} ${l[map.first_name]}`}</div>
      <div class="line__right">
        {groups.map(g => (
          <span class="badge primary">{g}</span>
        ))}
      </div>
    </div>
  );
}
