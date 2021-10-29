'use strict';
require('./redisConnet');
const redis = require('@condor-labs/redis')();
const { promisify } = require('util');

const client = async () => {
  const client = await redis.getClient();
  const get = promisify(client.get).bind(client);
  const set = promisify(client.set).bind(client);

  return {
    get,
    set,
  };
};

module.exports = client;
