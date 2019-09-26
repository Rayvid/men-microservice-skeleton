const { mongo: mongoConfig } = require('../../../config');
const mongoose = require('mongoose');

/**
 * Generates a mongo connection url from partials
 * @param {Object} mongoConfig MongoDB connection credentials from config
 */
const generateConnectionUrl = (dbName) => {
  if (mongoConfig.fullConnString) {
    return mongoConfig.fullConnString.replace('{dbName}', dbName);
  }

  const auth =
    (mongoConfig.user && mongoConfig.user !== ''
      && mongoConfig.password && mongoConfig.password !== '')
      ? `${mongoConfig.user}:${mongoConfig.password}@` : '';
  const port =
    mongoConfig.schema.indexOf('srv') === -1 // No port for srv
      && mongoConfig.port
      ? `:${mongoConfig.port}`
      : '';
  const database = `/${dbName || mongoConfig.database}`;
  const params = (mongoConfig.params && mongoConfig.params !== '') ? `?${mongoConfig.params}` : '';
  return `${mongoConfig.schema}://${auth}${mongoConfig.host}${port}${database}${params}`;
};

/**
 * Mongoose connection management - default one does not support multidatabase
 *
 * Connection factory with built-in connection pooling per database
 * @throws {MongoError} On connection issues
 */
const options = {
  keepAlive: true,
  keepAliveInitialDelay: 30000,
  poolSize: (mongoConfig.poolSize && parseInt(mongoConfig.poolSize, 10)) || 5,
};

const connections = {};

const gracefulExit =
  () =>
    Object
      .values(connections)
      .map(connection => connection.close && connection.close(() => process.exit(0)));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

const dbConnectionFactory = async (database) => {
  let connection = connections[database];

  if (typeof connection === 'undefined' || connection === null) {
    connection = await mongoose
      .createConnection(generateConnectionUrl(database), options);
    
      // Creating synthetic .dbName propery, appears .name is not reliable in some scenarios
    connection.dbName = database;

    connections[database] = connection;
  }

  return connection;
};


const getConnection = async database => dbConnectionFactory(database);

module.exports = { getConnection };
