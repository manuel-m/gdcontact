'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var dotenv = require('dotenv');
var fs = require('fs');

const conf = {};

Object.assign(conf, dotenv.config().parsed);

const data = {
  contacts: [],
  campaigns: [],
};

var model = {
  data,
  load,
  save,
};

function load() {
  Object.assign(data, JSON.parse(fs.readFileSync('data.json')));
}

function save() {
  const jsonDb = JSON.stringify(data, undefined, 1);

  fs.writeFileSync('data.json', jsonDb, function(err) {
    if (err) return console.log(err);
  });
}

function contacts(req, res) {
  console.log(req.body);
  return res.json(model.data.contacts);
}

model.load();

const app = express();
const { SERVER_HOST, SERVER_PORT } = conf;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/contacts', contacts);

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.info(`server listen on ${SERVER_PORT}`);
});
