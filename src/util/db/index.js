const config = require('config');
const mongoose = require('mongoose');

const mongoConfig = config.get('db.mongo');

/**
 * Generates a mongo connection url from partials
 * @param {Object} mongoConfig MongoDB connection credentials from config
 */
const generateConnectionUrl = (dbName) => {
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
 * Mongoose connection management
 *
 * Connection factory with reusability of existing instances
 * @throws {MongoError} On connection issues
 */
const maxPoolSize = 5; // TODO some elasticity maybe
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
      mongoose
        .createConnection(generateConnectionUrl(database))
        .then((con) => {
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
