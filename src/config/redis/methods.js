'use strict';
const redis = require('@condor-labs/redis')();
const { promisify } = require('util');

const client = {
  getClient: async () => {
    const client = await redis.getClient();
    const get = promisify(client.get).bind(client);
    const set = promisify(client.set).bind(client);
    const del = promisify(client.del).bind(client);
    return {
      get,
      set,
      del,
    };
  },
};
module.exports = client;
