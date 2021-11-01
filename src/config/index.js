const { MongoDB } = require('./mongodb/setting');
const redis = require('./redis/methods');

module.exports = {
  MongoDB,
  redis,
};
