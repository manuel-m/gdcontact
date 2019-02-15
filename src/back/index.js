import express from 'express';

import conf from './conf';
import contacts from './contacts';

import model from './model';

model.load();

const app = express();
const { SERVER_HOST, SERVER_PORT } = conf;

app.use(express.static('public'));
app.get('/api/contacts', contacts);

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.info(`server listen on ${SERVER_PORT}`);
});
