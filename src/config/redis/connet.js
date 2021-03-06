'use strict';
const logger = require('@condor-labs/logger');
const { setting, keyName } = require('./settting');

function connectRedis() {
  try {
    const redis = require('@condor-labs/redis')(setting);
    (async () => {
      const client = await redis.getClient();

      const redisBatch = client.batch();
      await redisBatch.incr(keyName);
      await redisBatch.expire(keyName, 1);
      const resolve = await redisBatch.execAsync();

      logger.info(
        resolve && resolve.length > 0 && resolve[0] > 0
          ? `REDIS Client connected OK!!!`
          : `REDIS Client connection failed :(`
      );
    })();
  } catch (error) {
    logger.error('Error connection to redis', error);
  }
}

module.exports = connectRedis;
