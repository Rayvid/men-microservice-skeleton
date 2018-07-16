const mongoose = require('mongoose');
const config = require('config');
const lympoMainStoreInitializer = require('lympo-mainstore');

const mongoConfig = config.get('db.mongo');

/**
 * Generates a mongo connection url from partials
 * @param {Object} mongoConfig MongoDB connection credentials from config
 */
const generateConnectionUrl = (dbName) => {
  const auth = (mongoConfig.user && mongoConfig.password) ? `${mongoConfig.user}:${mongoConfig.password}@` : '';
  const port = (mongoConfig.port) ? `:${mongoConfig.port}` : '';
  const database = `/${(dbName || mongoConfig.database)}`;
  return `${mongoConfig.schema}://${auth}${mongoConfig.host}${port}${database}`;
};

/**
 * Mongoose connection management
 *
 * Connection factory with reusability of existing instances\
 * @throws {MongoError} On connection issues
 */
const connectedDatabases = {};
const dbConnectionFactory = async database =>
  new Promise((resolve, reject) => {
    if (!connectedDatabases[database]) {
      mongoose.createConnection(generateConnectionUrl(database))
        .then((con) => {
          connectedDatabases[database] = con;
          resolve(con);
        })
        .catch(reject);
    } else {
      resolve(connectedDatabases[database]);
    }
  });

/**
 * Mongoose models management - get models for connection
 */
const models = {};
const getModels = async (database = 'Users') => {
  const dbConnection = await dbConnectionFactory(database);
  if (!models[database]) {
    switch (database) {
      default:
        models[database] = lympoMainStoreInitializer(dbConnection);
        break;
    }
  }

  return models[database];
};

module.exports = { connectedDatabases, dbConnectionFactory, getModels, models };
