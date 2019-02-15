import dotenv from 'dotenv';

const conf = {};

Object.assign(conf, dotenv.config().parsed);

export default conf;
