'use strict';

var dotenv = require('dotenv');
var express = require('express');

const conf = {};

Object.assign(conf, dotenv.config().parsed);

const app = express();
const host = conf.SERVER_HOST;
const port = conf.SERVER_PORT;

app.use(express.static('public'));

app.listen(port, host, () => {
  console.info(`server listen on ${port}`);
});
