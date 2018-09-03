const mongoose = require('mongoose');
const config = require('../../../config');
const model = require('../../model');

const mongoConfig = config.mongo;

/**
 * Generates a mongo connection url from partials
 * @param {Object} mongoConfig MongoDB connection credentials from config
 */
const generateConnectionUrl = (dbName) => {
  const auth =
    (mongoConfig.user && mongoConfig.user !== ''
      && mongoConfig.password && mongoConfig.password !== '')
      ? `${mongoConfig.user}:${mongoConfig.password}@` : '';
  const port = mongoConfig.port ? `:${mongoConfig.port}` : '';
  const database = `/${dbName || mongoConfig.database}`;
  const params = (mongoConfig.params && mongoConfig.params !== '') ? `?${mongoConfig.params}` : '';
  return `${mongoConfig.schema}://${auth}${mongoConfig.host}${port}${database}${params}`;
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
      mongoose
        // TODO pooling - single connection per replica wont hold
        .createConnection(generateConnectionUrl(database))
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
const getModels = async (database = 'SportsApps') => {
  const dbConnection = await dbConnectionFactory(database);
  if (!models[database]) {
    switch (database) {
      // There you can separate models initialization by database,
      // or just keep default if you are using single DB - which is recommended
      default:
        models[database] = model(dbConnection);
        break;
    }
  }

  return models[database];
};

module.exports = { connectedDatabases, dbConnectionFactory, getModels, models };
