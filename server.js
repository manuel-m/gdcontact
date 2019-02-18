'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var parse = require('csv-parse/lib/sync');

const conf = JSON.parse(fs.readFileSync('public/config.json'));

const data = {
  contacts: [],
  campaigns: [],
  emails: [],
  mails: [],
  organizations: [],
};

var model = {
  data,
  save,
};

function save() {
  const jsonDb = JSON.stringify(data, undefined, 1);

  fs.writeFileSync('data.json', jsonDb, function(err) {
    if (err) return console.log(err);
  });
}

var contacts = {
  load,
  middleWare,
};

load();

function load() {
  const fileContent = fs.readFileSync('db/contacts/contacts.csv', {
    encoding: 'utf8',
  });

  const { delimiter, quote } = conf.contacts.format;

  model.data.contacts = parse(fileContent, {
    delimiter,
    quote,
    skip_empty_lines: true,
  });
}

function middleWare(req, res) {
  return res.json(model.data.contacts);
}

function organizations(req, res) {
  console.log(req.body);
  return res.json(model.data.organizations);
}

const app = express();
const { host, port } = conf.server;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/contacts', contacts.middleWare);
app.get('/api/organizations', organizations);

app.listen(port, host, () => {
  console.info(`server listen on ${port}`);
});
