'use strict';
require('dotenv').config();
const logger = require('@condor-labs/logger');
const mongo = require('@condor-labs/mongodb')();
const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;

const mongoDb = async () => {
  try {
    await mongo.mongoose.connect(`mongodb+srv://root:root@cluster0.aqa7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info(`database Conected Mongodb`);
  } catch (error) {
    logger.err('Error conecting to mongodb', error);
  }
};

module.exports = mongoDb;


// user: 'root', pass: 'root',
//       replicaSet: 'cluster0-shard-0',
//       ssl: true,
//       authSource: "admin ",