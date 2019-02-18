import { readFileSync } from 'fs';

import conf from './conf';
import parse from 'csv-parse/lib/sync';
import model from './model';

export default {
  load,
  middleWare,
};

load();

function load() {
  const fileContent = readFileSync('db/contacts/contacts.csv', {
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
