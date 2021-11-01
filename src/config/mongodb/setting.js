'use strict';

const {
  MONGO_CONNECTION_NAME,
  MONGO_HOST,
  MONGO_AUTH_SOURCE,
  MONGO_DATABASE,
  MONGO_PASSWORD,
  MONGO_REPLICASET,
  MONGO_SSL,
  MONGO_USER,
  MONGO_PORT,
  MONGO_DATABASE_TEST,
} = process.env;

const settingPro = {
  connectionName: MONGO_CONNECTION_NAME,
  host: MONGO_HOST,
  port: parseInt(MONGO_PORT),
  database: process.env.NODE_ENV === 'test' ? MONGO_DATABASE_TEST : MONGO_DATABASE,
  user: MONGO_USER,
  password: MONGO_PASSWORD,
  ssl: MONGO_SSL === '1',
  replicaSet: MONGO_REPLICASET,
  authSource: MONGO_AUTH_SOURCE,
};

const settingDev = {
  connectionName: MONGO_CONNECTION_NAME,
  host: MONGO_HOST,
  port: MONGO_PORT,
  database: MONGO_DATABASE,
  user: MONGO_USER,
  password: MONGO_PASSWORD,
  ssl: MONGO_SSL === '1',
};

const setting = process.env.NODE_ENV === 'production' ? settingPro : settingDev;

const MongoDB = require('@condor-labs/mongodb')(setting);

module.exports = {
  MongoDB,
};
