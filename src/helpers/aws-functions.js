const logger = require('@condor-labs/logger');
const axios = require('axios');

const getEnv = async () => {
  const rep = await axios.get(
    `https://u5rjp0vnf1.execute-api.us-east-1.amazonaws.com/dev/envirotment/${process.env.NODE_ENV}`
  );
  const { input: message } = rep.data;
  logger.info(`${message}`);
};

module.exports = getEnv;
