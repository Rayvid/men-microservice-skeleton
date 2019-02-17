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
const maxPoolSize = 3; // TODO some elasticity maybe
const connectedDatabases = {};
const roundRobinResolve = (database, resolve) => {
  connectedDatabases[database].lastPoolItemUsed += 1;
  if (connectedDatabases[database].lastPoolItemUsed === maxPoolSize) {
    connectedDatabases[database].lastPoolItemUsed = 0;
  }

  resolve(connectedDatabases[database]
    .connections[connectedDatabases[database].lastPoolItemUsed]);
};

const dbConnectionFactory = async database =>
  new Promise((resolve, reject) => {
    if (!connectedDatabases[database]
      || connectedDatabases[database].connections.length < maxPoolSize) {
      // Relying on mongoose/mongo driver to reestablish connection on error
      mongoose
        .createConnection(generateConnectionUrl(database), {
          useNewUrlParser: true,
          db: { readPreference: 'secondaryPreferred' },
          keepAlive: true,
          keepAliveInitialDelay: 30000,
          noDelay: true,
        }).then((con) => {
          if (!connectedDatabases[database]) {
            connectedDatabases[database] = {
              connections: [con],
              lastPoolItemUsed: -1,
            };
          } else {
            connectedDatabases[database].connections.push(con);
          }

          // Creating synthetic .dbName propery, appears .name is not reliable
          connectedDatabases[database]
            .connections[connectedDatabases[database].connections.length - 1]
            .dbName = database;

          roundRobinResolve(database, resolve);
        })
        .catch(reject);
    } else {
      roundRobinResolve(database, resolve);
    }
  });


const getConnection = async database => dbConnectionFactory(database);

module.exports = { getConnection };
