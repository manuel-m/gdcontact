import { readFileSync } from 'fs';

const conf = JSON.parse(readFileSync('public/config.json'));

export default conf;
