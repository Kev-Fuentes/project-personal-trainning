'use strict';
require('dotenv').config();
const logger = require('@condor-labs/logger');
const mongo = require('@condor-labs/mongodb')();
const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;

const mongoDb = async () => {
  try {
    await mongo._connectSingleConnection({ url: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}` });

    logger.info(`database Conected Mongodb`);

  } catch (error) {
    logger.err("Error conecting to mongodb", error);
  }
};

module.exports = mongoDb;
