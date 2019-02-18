import { createElement } from 'inferno-create-element';

export default function Mails(props) {
  return (
    <div class="contacts-list">
      <div class="panel-top shadow" />
      <div class="panel-header">
        <div class="toolbar">
          <div class="toolbar__left">
            <span class="toolbar__item">Nouveau</span>
          </div>
        </div>
      </div>
      <div class="panel-body shadow">
        <ul>
          <li class="contact-line">Destinataire</li>
        </ul>
      </div>
    </div>
  );
}
