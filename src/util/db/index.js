import mongoose from 'mongoose';
import {mongo as mongoConfig} from '../../../config/index.js';

/**
 * Generates a mongo connection url
 * @param {Object} dbName if connection string allows dynamically replace dbName
 * @return {*}
 */
const generateConnectionUrl = (dbName) => {
  if (mongoConfig.fullConnString) {
    return mongoConfig.fullConnString.replace('{dbName}', dbName);
  }

  const auth = (mongoConfig.user && mongoConfig.user !== '' &&
      mongoConfig.password && mongoConfig.password !== '') ?
      `${mongoConfig.user}:${mongoConfig.password}@` : '';
  const port = mongoConfig.schema.indexOf('srv') === -1 /* No port for srv */ && mongoConfig.port ?
      `:${mongoConfig.port}` :
      '';
  const database = `/${dbName || mongoConfig.database}`;
  const params = (mongoConfig.params) ? `?${mongoConfig.params}` : '';
  return `${mongoConfig.schema}://${auth}${mongoConfig.host}${port}${database}${params}`;
};

const options = {
  keepAlive: true,
  keepAliveInitialDelay: 30000,
  maxPoolSize: (mongoConfig.poolSize && parseInt(mongoConfig.poolSize, 10)) || 5,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Mongoose connection management - default one does not support multidatabase
const connections = {};
const gracefulExit = () => Object
    .values(connections)
    .map((connection) => connection.close && connection.close(() => process.exit(0)));
// If the Node process ends, close all the connections
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

export const getConnection = async (database) => {
  let connection = connections[database];

  if (typeof connection === 'undefined' || connection === null) {
    connection = await mongoose.createConnection(generateConnectionUrl(database), options);

    connections[database] = connection;
  }

  return connection;
};
