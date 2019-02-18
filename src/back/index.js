import bodyParser from 'body-parser';
import express from 'express';

import conf from './conf';
import contacts from './contacts';
import organizations from './organizations';

const app = express();
const { host, port } = conf.server;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/contacts', contacts.middleWare);
app.get('/api/organizations', organizations);

app.listen(port, host, () => {
  console.info(`server listen on ${port}`);
});
