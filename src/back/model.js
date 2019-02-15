import { readFileSync, writeFileSync } from 'fs';

const data = {
  contacts: [],
  campaigns: [],
};

export default {
  data,
  load,
  save,
};

function load() {
  Object.assign(data, JSON.parse(readFileSync('data.json')));
}

function save() {
  const jsonDb = JSON.stringify(data, undefined, 1);

  writeFileSync('data.json', jsonDb, function(err) {
    if (err) return console.log(err);
  });
}
