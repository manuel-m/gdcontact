import { readFileSync, writeFileSync } from 'fs';

const data = {
  contacts: [],
  campaigns: [],
  emails: [],
  mails: [],
  organizations: [],
};

export default {
  data,
  save,
};

function save() {
  const jsonDb = JSON.stringify(data, undefined, 1);

  writeFileSync('data.json', jsonDb, function(err) {
    if (err) return console.log(err);
  });
}
