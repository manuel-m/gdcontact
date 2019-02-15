import conf from './conf';

import express from 'express';

const app = express();
const host = conf.SERVER_HOST;
const port = conf.SERVER_PORT;

app.use(express.static('public'));

app.listen(port, host, () => {
  console.info(`server listen on ${port}`);
});
