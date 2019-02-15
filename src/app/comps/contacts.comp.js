import { linkEvent } from 'inferno';
import { createElement } from 'inferno-create-element';

export default function Contacts(props) {
  return (
    <div class="contacts-list">
      <div class="panel-top shadow" />
      <div class="panel-header">TEST</div>
      <div class="panel-body shadow">
        <ul>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
          <li class="contact-line">Contact</li>
        </ul>
      </div>
    </div>
  );
}
