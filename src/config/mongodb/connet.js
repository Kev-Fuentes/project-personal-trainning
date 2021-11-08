'use strict';
const { MongoDB } = require('./setting');
const logger = require('@condor-labs/logger');

function connetMongo() {
  (async () => {
    try {
      await MongoDB.getClient();
      logger.info(`Mongo database conected is Dev: ${MongoDB._isConnected()}`);

      process.on('SIGINT', async () => {
        process.exit();
      });
    } catch (error) {
      logger.error('error in database', error);
      process.exit(1);
    }
  })();
}

module.exports = connetMongo;
