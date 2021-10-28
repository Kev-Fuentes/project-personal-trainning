const mongoDb = require('./mongodb/mongoConnet');
const redis = require('./redis/redisMethods');

module.exports = {
  mongoDb,
  redis,
};
